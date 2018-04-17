'use strict';

angular.module('shenmaApp')
    .factory('organizationUtil', () => {
        const ROOT = 0;

        let utils = {

            /*
             * It's unsafety cause origin data modified.
             * @param nodes {Array}
             * @param parentNode {Object}
             * @return void
             */
            setParentNode: (nodes, parentNode) => {
                let i = 0;
                while (i < nodes.length) {
                    nodes[i].parent = parentNode;

                    if (nodes[i].children.length) {
                        utils.setParentNode(nodes[i].children, nodes[i]);
                    }

                    i++;
                }
            },

            /*
             * Refactor the original tree data as standard struct in front end.
             * @param origin {Array}
             * @return {Array}
             */
            reMapTreeNode: (origin) => {
                const indexs = origin.map(d => d.id);
                let i = 0;

                origin = origin.map(d => {
                    d.name = d.partName;
                    d.children = [];
                    return d;
                });

                while (i < origin.length) {
                    if (origin[i].parentId > 0) {
                        const parentNode = origin[ indexs.indexOf(origin[i].parentId) ];
                        origin[i].parent = parentNode;
                        parentNode.children.push(origin[i]);
                    }

                    i++;
                }

                return origin.filter(d => d.parentId === ROOT);
            },

            /*
             * Count the number of employee in children array.
             * @param node {Array}
             * @return {Number}
             */
            countAllEmployee: (node) => {
                return countIter(node, 0, 0);
            },

            orderByGroup: (nodes) => {
                nodes = nodes.sort((p, n) => p.parentId - n.parentId);

                let i = 1;
                let ids = nodes.map(d => d.id);
                const length = nodes.length;

                while (i < length) {
                    if (nodes[i].parentId !== nodes[i - 1].id && nodes[i].parentId !== nodes[i - 1].parentId) {
                        const node = nodes.splice(i, 1)[0];
                        const parentIndex = ids.indexOf(node.parentId);
                        nodes.splice(parentIndex + 1, 0, node);
                        ids = nodes.map(d => d.id);
                    }
                    i++;
                }

                return nodes.map(d => {
                    d.indent = d.partNo.length;
                    return d;
                });
            }
        };

        function countIter (node, index, total) {
            if (index < node.length) {
                return countIter(node, index + 1, total + node[index].employNumber);
            } else {
                return total;
            }
        }

        return utils;
    });
