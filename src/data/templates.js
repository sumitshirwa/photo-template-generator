/*
  PNG Template System
  Add PNG templates inside /public/templates/
*/

export const CANVAS_DIMENSIONS = 600;

/* ---------------- TEMPLATE LIST ---------------- */

const templateDefinitions = [

  {
    id: "Template 1",
    name: "Template 1",
    image: "/templates/template1.png",
    icon: "/templates/template1.png",
  },
  {
    id: "Template 2",
    name: "Template 2",
    image: "/templates/template2.png",
    icon: "/templates/template2.png",
  },

  {
    id: "Template 3",
    name: "Template 3",
    image: "/templates/template3.png",
    icon: "/templates/template3.png",
  },

  {
    id: "Template 4",
    name: "Template 4",
    image: "/templates/template4.png",
    icon: "/templates/template4.png",
  },
];

export function getFrameDataURL(templateId) {
  const template = templateDefinitions.find(
    (t) => t.id === templateId
  );

  return template ? template.image : null;
}

/* ---------------- GET THUMBNAIL ---------------- */

export function getThumbnailDataURL(templateId) {
  const template = templateDefinitions.find(
    (t) => t.id === templateId
  );

  return template ? template.image : null;
}

/* ---------------- EXPORT TEMPLATE LIST ---------------- */

export const templates = templateDefinitions.map(
  ({ id, name, icon }) => ({
    id,
    name,
    icon,
  })
);