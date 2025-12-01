export async function register() {
  if (typeof globalThis.localStorage !== 'undefined') {
    const ls = globalThis.localStorage;
    if (typeof ls.getItem !== 'function') {
      const storage = new Map<string, string>();
      (globalThis as Record<string, unknown>).localStorage = {
        getItem: (key: string) => storage.get(key) ?? null,
        setItem: (key: string, value: string) => storage.set(key, value),
        removeItem: (key: string) => storage.delete(key),
        clear: () => storage.clear(),
        key: (index: number) => Array.from(storage.keys())[index] ?? null,
        get length() { return storage.size; },
      };
    }
  }
}

export async function onRequestError(
  error: { digest: string } & Error,
  request: {
    path: string;
    method: string;
    headers: { [key: string]: string };
  },
  context: {
    routerKind: 'Pages Router' | 'App Router';
    routePath: string;
    routeType: 'render' | 'route' | 'action' | 'middleware';
    renderSource:
      | 'react-server-components'
      | 'react-server-components-payload'
      | 'server-rendering';
    revalidateReason: 'on-demand' | 'stale' | undefined;
    renderType: 'dynamic' | 'dynamic-resume';
  }
) {
  if (error.message?.includes('localStorage')) {
    console.warn(
      '[HyperWear] localStorage error detected. This is likely due to Node.js v25+ incompatibility.',
      'Consider using Node.js v20 or v22 LTS.',
      { path: request.path, routePath: context.routePath }
    );
  }
}
