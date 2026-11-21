import {oauthRegistrationUrl,oauthHomepage} from './oauth-setup.mjs';

const panelId = 'github-account';
const activeLogin = login => login.state === 'preparing' || login.state === 'waiting';
const toast = text => ({type: 'toast', text});

export function githubMobileView() {
  return {
    v: 2, type: 'stack', title: 'GitHub',
    children: [
      {type: 'text', text: {$: 'data.status'}},
      {type: 'collapsible', label: '首次登录？配置 GitHub OAuth App', children: [
        {type: 'text', text: '已有启用了设备流的 OAuth App？直接用原来的 Client ID，同一个 ID 可用于电脑和手机。'},
        {type: 'actions', items: [{label: '打开 OAuth App 注册页', action: 'register-app'}]},
        {type: 'text', text: '应用名称可填 DeepSeek GitHub Studio。应用描述可留空。'},
        {type: 'text', text: '主页 URL 填 ' + oauthHomepage},
        {type: 'text', text: '重定向 URI 填和主页 URL 一样的仓库地址。通配符保持关闭。'},
        {type: 'actions', items: [
          {label: '复制主页 URL', action: 'copy-homepage'},
          {label: '复制重定向 URI', action: 'copy-redirect'}
        ]},
        {type: 'text', text: '勾选「启用设备流」后注册。复制应用详情里的 Client ID，粘贴到下方并保存。无需 Client Secret。'},
        {type: 'text', text: '点「登录 GitHub」获取设备码，再打开授权页，输入设备码并确认。'}
      ]},
      {type: 'form', submit: 'configure', submitLabel: '保存 Client ID', children: [
        {type: 'textField', label: 'OAuth App Client ID', bind: 'data.form.clientId',
          placeholder: '粘贴你的 Client ID', minLength: 5, maxLength: 120, required: true}
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
      'register-app': () => ({type: 'link', url: oauthRegistrationUrl}),
      'copy-homepage': () => ({type: 'copy', text: oauthHomepage}),
      'copy-redirect': () => ({type: 'copy', text: oauthHomepage}),
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
