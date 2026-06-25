export const K8S_DNS1035_NAME_MAX_LENGTH = 63;
export const SERVICE_NODEPORT_SUFFIX_LENGTH = 22;
export const POD_GENERATED_SUFFIX_LENGTH = 16;

// 25 = 63 DNS-1035 max - 22 nodeport service suffix - 16 pod suffix.
export const APP_NAME_MAX_LENGTH =
  K8S_DNS1035_NAME_MAX_LENGTH - SERVICE_NODEPORT_SUFFIX_LENGTH - POD_GENERATED_SUFFIX_LENGTH;

export const DNS1035_NAME_PATTERN = /^[a-z]([-a-z0-9]*[a-z0-9])?$/;
export const INVALID_APP_NAME_MESSAGE_KEY = 'invalid_app_name';
export const INVALID_SERVICE_NAME_MESSAGE_KEY = 'invalid_service_name';

export const isValidDns1035Name = (name: string) =>
  name.length > 0 && name.length <= K8S_DNS1035_NAME_MAX_LENGTH && DNS1035_NAME_PATTERN.test(name);

export const isValidAppName = (name: string) =>
  name.length > 0 && name.length <= APP_NAME_MAX_LENGTH && DNS1035_NAME_PATTERN.test(name);

type NamedKubernetesResource = {
  kind?: string;
  metadata?: {
    name?: unknown;
  };
};

export const getInvalidDns1035ServiceNameMessage = (resources: NamedKubernetesResource[]) => {
  const invalidResource = resources.find((resource) => {
    const name = resource?.metadata?.name;
    return resource.kind === 'Service' && typeof name === 'string' && !isValidDns1035Name(name);
  });

  if (!invalidResource) return;

  return `${invalidResource.kind || 'Resource'} "${
    invalidResource.metadata?.name
  }" has an invalid name. Names must start with a lowercase letter, contain only lowercase letters, numbers, or hyphens, and end with a lowercase letter or number.`;
};

export const getInvalidAppNameMessage = (name: unknown) => {
  if (typeof name !== 'string' || isValidAppName(name)) return;

  return `Application name "${name}" is invalid. Use ${APP_NAME_MAX_LENGTH} characters or fewer, start with a lowercase letter, use only lowercase letters, numbers, or hyphens, and end with a lowercase letter or number.`;
};

export const getInvalidNameMessageI18nKey = (message: unknown) => {
  if (typeof message !== 'string') return;

  if (/^Application name ".+" is invalid\./.test(message)) {
    return INVALID_APP_NAME_MESSAGE_KEY;
  }

  if (/^Service ".+" has an invalid name\./.test(message)) {
    return INVALID_SERVICE_NAME_MESSAGE_KEY;
  }
};
