import React from "react";

export function Introduce() {
  return (
    <div>
      <h2>1. What is Copilot connector</h2>
      <p>
        Microsoft Search indexes all your Microsoft 365 data to make it
        searchable for users. With Microsoft Copilot connectors, your organization
        can index third-party data so it appears in Microsoft Search results.
        This feature expands the types of content sources that are searchable in
        your Microsoft 365 productivity apps and the broader Microsoft
        ecosystem. The third-party data can be hosted on-premises or in the
        public or private clouds.
      </p>
      <p>
        Please read more about custom Copilot connectors in this{" "}
        <a
          href="https://docs.microsoft.com/en-us/graph/connecting-external-content-connectors-overview"
          target="_blank"
          rel="noreferrer"
        >
          document
        </a>
        .
      </p>
    </div>
  );
}
