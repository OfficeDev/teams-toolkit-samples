import "./Query.css";
import { KeyboardEvent, useState } from "react";
import { Input, Loader, Table } from "@fluentui/react-northstar";
import { SearchIcon } from '@fluentui/react-icons-northstar'
import { createMicrosoftGraphClient, TeamsFx } from "@microsoft/teamsfx";
import { ConnectionId, Scopes } from "./lib/constants";

export function Query() {
  const [query, setQuery] = useState("");
  const [data, setData] = useState<any[]>([]);
  const [error, setError] = useState<any>("");
  const [loading, setLoading] = useState(false);
  const header = {
    items: ['PartNumber',
      'Name',
      'Description',
      'Price',
      'Inventory',
      'Appliances'],
  }

  async function search(e: KeyboardEvent) {
    if (e.key === "Enter" && query) {
      setLoading(true);

      const searchContent = {
        requests: [
          {
            entityTypes: [
              'externalItem'
            ],
            contentSources: [
              `/external/connections/${ConnectionId}`
            ],
            query: {
              queryString: query
            },
            from: 0,
            size: 25,
            fields: [
              'partNumber',
              'name',
              'description',
              'price',
              'inventory',
              'appliances'
            ]
          }
        ]
      };

      try {
        const teamsfx = new TeamsFx();
        const graph = createMicrosoftGraphClient(teamsfx, Scopes);

        const result = await graph.api('/search/query')
          .version('beta')
          .post(searchContent);

        let rows: any[] = [];

        if (result.value[0].hitsContainers[0].total) {
          const items: any[] = result.value[0].hitsContainers[0].hits;
          rows = items.map((element, index) => {
            const properties = element.resource.properties;
            return {
              key: index,
              items: [
                {
                  content: properties.partNumber,
                  truncateContent: true,
                },
                {
                  content: properties.name,
                  truncateContent: true,
                },
                {
                  content: properties.description,
                  truncateContent: true,
                },
                {
                  content: properties.price,
                  truncateContent: true,
                },
                {
                  content: properties.inventory,
                  truncateContent: true,
                },
                {
                  content: properties.appliances.join(','),
                  truncateContent: true,
                }
              ],
            };
          })
        }
        setData(rows);
        setError("");
      } catch (error) {
        setError(error)
      } finally {
        setLoading(false)
      }
    }
  }

  return (
    <div className="query page">
      <div className="section-margin">
        <h2>Query Data from Graph Connector</h2>
        <Input className="search" inverted role="search" icon={<SearchIcon />}
          placeholder="Type keyword (e.g. 'Contoso') and press 'Enter' to search" iconPosition="start" value={query}
          onChange={(e: any) => setQuery(e.target.value)}
          onKeyDown={(e) => search(e)}
        />
        {loading && (
          <div>
            <Loader style={{ margin: 100 }} />
          </div>
        )}
        {!loading && !error && (
          <div>
            <Table header={header} rows={data} aria-label="Static table" />
          </div>
        )}
        {!loading && !!error && <div className="error fixed">{error.toString()}</div>}
      </div>
    </div>
  );
}
