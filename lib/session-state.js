export function mergeConnectionState(previous, next) {
  const transient = next.hasCredential && next.errorKind && next.errorKind !== 'auth';
  return transient && previous?.user ? {...next, user: previous.user} : next;
}
