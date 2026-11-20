const panelId = 'github-account';
const activeLogin = login => login.state === 'preparing' || login.state === 'waiting';
const toast = text => ({type: 'toast', text});

export function githubMobileView() {
  return {
    v: 2, type: 'stack', title: 'GitHub',
    children: [
      {type: 'text', text: {$: 'data.status'}},
      {type: 'form', submit: 'configure', submitLabel: '保存 Client ID', children: [
        {type: 'textField', label: 'OAuth App Client ID', bind: 'data.form.clientId',
          minLength: 5, maxLength: 120, required: true}
      ]},
      {type: 'actions', items: [
        {label: '登录 GitHub', action: 'login'},
        {label: '打开授权页', action: 'authorize'}
      ]},
      {type: 'actions', items: [
        {label: '复制设备码', action: 'copy-code'},
        {label: '取消登录', action: 'cancel'},
        {label: '刷新状态', action: 'refresh'}
      ]},
      {type: 'confirm', id: 'disconnect', text: '断开当前 GitHub 连接？',
        confirmLabel: '断开连接', cancelLabel: '取消'},
      {type: 'text', tone: 'muted', text: '浏览仓库、发布版本和确认写入，请在 DSH Go 的网页版打开「设置 → GitHub」。'}
    ]
  };
}

export function registerMobilePanel(ctx, {auth, api, ops}) {
  const listeners = new Set();
  let account = '', error = '', clientId = '', version = 0, timer;
  let checking;
  const status = () => {
    const {state, code, message} = auth.login;
    if (state === 'waiting') return '设备码：' + code + (message ? '\n' + message : '');
    if (state === 'preparing') return message || '正在请求 GitHub 设备码…';
    if (state === 'error') return message || 'GitHub 授权失败';
    return error || (account ? '已连接 @' + account : '尚未连接 GitHub');
  };
  const snapshot = () => ({status: status().slice(0, 400), form: {clientId}});
  const publish = () => { for (const emit of listeners) emit(snapshot()); };
  const refresh = () => {
    if (checking) return checking;
    const generation = version;
    checking = (async () => {
      const id = await auth.clientId();
      let user = '', failure = '';
      if (!activeLogin(auth.login) && await auth.hasCredential()) {
        try { user = (await api.me()).login; }
        catch (e) { failure = e.message; }
      }
      if (generation === version) {
        clientId = id || '';
        account = user || '';
        error = failure;
        publish();
      }
    })().finally(() => { checking = undefined; });
    return checking;
  };
  const refreshInBackground = () => refresh().catch(() => {});
  const background = action => ({
    pending: {label: 'GitHub', timeoutMs: 30000},
    async result() {
      try { return await action(); }
      catch (e) { return toast(e.message.slice(0, 40)); }
    }
  });
  ctx.dshGo.panel(panelId, {
    view: githubMobileView,
    data(_scope, emit) {
      listeners.add(emit);
      emit(snapshot());
      if (!timer) {
        refreshInBackground();
        let last = auth.login.state;
        timer = setInterval(() => {
          publish();
          const state = auth.login.state;
          if (state !== last && !activeLogin(auth.login)) refreshInBackground();
          last = state;
        }, 2000);
        timer.unref?.();
      }
      return () => {
        listeners.delete(emit);
        if (!listeners.size) { clearInterval(timer); timer = undefined; }
      };
    },
    actions: {
      configure: (_scope, event) => background(async () => {
        const value = event.value?.values?.['data.form.clientId'];
        if (typeof value !== 'string') return toast('请输入 Client ID');
        await auth.configure(value.trim());
        version++;
        clientId = value.trim();
        publish();
        return toast('Client ID 已保存');
      }),
      async login() {
        try {
          await auth.start();
          publish();
          auth.task?.then(refreshInBackground);
        } catch (e) { publish(); return toast(e.message.slice(0, 40)); }
      },
      authorize: () => auth.login.state === 'waiting'
        ? {type: 'link', url: 'https://github.com/login/device'} : toast('请先获取设备码'),
      'copy-code': () => auth.login.state === 'waiting' && auth.login.code
        ? {type: 'copy', text: auth.login.code} : toast('暂无设备码'),
      cancel() {
        if (activeLogin(auth.login)) { auth.cancel(); publish(); }
      },
      refresh: () => background(async () => { await refresh(); return toast('状态已刷新'); }),
      disconnect: (_scope, event) => {
        if (event.value?.confirmed !== true) return;
        return background(async () => {
          await auth.logout();
          ops.clearPending();
          version++;
          account = '';
          error = '';
          publish();
          return toast('已断开 GitHub 连接');
        });
      }
    }
  });
}
