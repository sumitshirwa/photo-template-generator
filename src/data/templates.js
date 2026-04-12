/*
  PNG Template System
  Just add PNG templates inside /public/templates/
*/

export const CANVAS_DIMENSIONS = 600;


/* ---------------- TEMPLATE LIST ---------------- */

const templateDefinitions = [
  {
    id: "Template 1",
    name: "Template 1",
    image: "/public/templates/Template1.png",
    icon: "/public/templates/Template1.png",
  },

  {
    id: "Template 2 ",
    name: "Template 2",
    image: "/public/templates/Template2.png",
    icon: "/public/templates/Template2.png",
  },

  {
    id: "Template 3",
    name: "Template 3",
    image: "/public/templates/Template3.png",
    icon: "/public/templates/Template3.png",
  },

  {
    id: "Template 4",
    name: "Template 4",
    image: "/public/templates/Template4.png",
    icon: "/public/templates/Template4.png",
  },

  {
    id: "Template 5",
    name: "Template 5",
    image: "/public/templates/Template5.png",
    icon: "/public/templates/Template5.png",
  },

  {
    id: "Template 6",
    name: "Template 6",
    image: "/public/templates/Template6.png",
    icon: "/public/templates/Template6.png",
  },

  {
    id: "Template 7",
    name: "Template 7",
    image: "/public/templates/Template7.png",
    icon: "/public/templates/Template7.png",
  },

]

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