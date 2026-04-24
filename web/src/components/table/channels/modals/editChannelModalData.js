export function buildUniqueModels(models) {
  return Array.from(new Set(models || []));
}

export function buildModelOptions(models) {
  return (models || []).map((model) => {
    const id = String(model.id || '').trim();
    return {
      key: id,
      label: id,
      value: id,
    };
  });
}

export function buildGroupOptions(groups) {
  return (groups || []).map((group) => ({
    label: group,
    value: group,
  }));
}
