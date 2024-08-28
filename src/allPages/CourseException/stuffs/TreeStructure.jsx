import React, { useState, useEffect } from "react";
import "../styles/tree.css";

const treeData = [
  {
    id: "Maximum No Of Exemptions - 4",
    diamond: false,
    children: [
      {
        id: "NPTEL Max - 2",
        diamond: false,
      },
      {
        id: "One Credit Max - 1",
        diamond: false,
      },
      {
        id: "Add-On/Honors And Minors",
        diamond: false,
        children: [
          {
            id: "Honors/minors",
            diamond: false,
            children: [
              {
                id: "If Honors Max - 4",
                diamond: false,
              },
              {
                id: "If Minors Max - 2",
                diamond: false,
              },
            ],
          },
          {
            id: "If AddOns Max - 4",
            diamond: false,
          },
        ],
      },
      {
        id: "Internship Max - 1",
        diamond: false,
      },
    ],
  },
];

const TreeStructure = () => {
  return <div className="tree">{treeRendering(treeData)}</div>;
};

const treeRendering = (treeData) => {
  return (
    <>
      <ul>
        {treeData.map((item) => (
          <li className={item.text + item.id}>
            <div>{item.id}</div>
            {item.children && item.children.length
              ? treeRendering(item.children)
              : ""}
          </li>
        ))}
      </ul>
    </>
  );
};

export default TreeStructure;
