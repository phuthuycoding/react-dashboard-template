interface ResourceLanguage {
  [namespace: string]: {
    [key: string]: string | object;
  };
}

interface Resources {
  [language: string]: ResourceLanguage;
}

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
const localeFiles: Record<string, () => Promise<{ default: unknown }>> = import.meta.glob('./locales/**/*.json');

export const loadLocaleResources = async (): Promise<Resources> => {
  const resources: Resources = { en: {}, vi: {} };

  for (const path in localeFiles) {
    const module = await localeFiles[path]();
    const match = path.match(/\/(\w+)\/(\w+)\/(\w+)\/(\w+).json$/);
    if (match) {
      const namespace = match[4];
      const lang = match[3];
      if (!resources[lang]) {
        resources[lang] = {};
      }
      resources[lang][namespace] = module.default as { [key: string]: string | object };
    }
  }
  return resources;
};
