require("ts-node").register({ transpileOnly: true });

const { createFilePath } = require("gatsby-source-filesystem");
const path = require("path");

const {
  createDocs,
  createDocHome,
  createCloudAPIReference,
} = require("./gatsby/create-pages");
const { createExtraType } = require("./gatsby/create-types");

exports.createPages = async ({ graphql, actions }) => {
  await createDocHome({ graphql, actions });
  await createDocs({ graphql, actions });
  if (process.env.WEBSITE_BUILD_TYPE !== "archive") {
    await createCloudAPIReference({ graphql, actions });
    actions.createPage({
      path: "/search",
      component: path.resolve(
        __dirname,
        "./src/templates/DocSearchTemplate.tsx"
      ),
    });
  }
  actions.createPage({
    path: "/404",
    component: path.resolve(__dirname, "./src/templates/404Template.tsx"),
  });
};

exports.onCreateNode = ({ node, getNode, actions: { createNodeField } }) => {
  if (node.internal.type === "Mdx") {
    createNodeField({
      node,
      name: "slug",
      value: createFilePath({ node, getNode }),
    });
  }
};

exports.createSchemaCustomization = createExtraType;
