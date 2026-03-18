function getParentId(area) {
  if (!area?.parentAreaId) return null;

  if (typeof area.parentAreaId === "string") {
    return area.parentAreaId;
  }

  if (typeof area.parentAreaId === "object" && area.parentAreaId._id) {
    return area.parentAreaId._id;
  }

  return null;
}

export function buildAreaTree(areas = []) {
  const map = new Map();

  areas.forEach((area) => {
    map.set(area._id, {
      ...area,
      children: [],
    });
  });

  const roots = [];

  areas.forEach((area) => {
    const parentId = getParentId(area);
    const current = map.get(area._id);

    if (parentId && map.has(parentId)) {
      map.get(parentId).children.push(current);
    } else {
      roots.push(current);
    }
  });

  return roots;
}

export function flattenAreaTree(nodes = [], level = 0) {
  return nodes.flatMap((node) => [
    { ...node, level },
    ...flattenAreaTree(node.children || [], level + 1),
  ]);
}

export function getAreaDepthLabel(level) {
  if (level === 0) return "Root";
  return `Level ${level + 1}`;
}
