import "./Query.css";
import { KeyboardEvent, useState } from "react";
import {
  Input,
  Spinner,
  TableBody,
  TableCell,
  TableRow,
  Table,
  TableHeader,
  TableHeaderCell,
} from "@fluentui/react-components";
import { SearchRegular } from "@fluentui/react-icons";
import { TeamsUserCredential } from "@microsoft/teamsfx";
import { Client } from "@microsoft/microsoft-graph-client";
import { TokenCredentialAuthenticationProvider } from "@microsoft/microsoft-graph-client/authProviders/azureTokenCredentials";
import { ConnectionId, Scopes } from "./lib/constants";
import config from "./lib/config";

export function Query() {
  const [query, setQuery] = useState("");
  const [data, setData] = useState<any[]>([]);
  const [error, setError] = useState<any>("");
  const [loading, setLoading] = useState(false);
  const columns = [
    { columnKey: "partNumber", label: "Part Number" },
    { columnKey: "name", label: "Name" },
    { columnKey: "description", label: "Description" },
    { columnKey: "price", label: "Price" },
    { columnKey: "inventory", label: "Inventory" },
    { columnKey: "appliances", label: "Appliances" },
  ];

  async function search(e: KeyboardEvent) {
    if (e.key === "Enter" && query) {
      setLoading(true);

      const searchContent = {
        requests: [
          {
            entityTypes: ["externalItem"],
            contentSources: [`/external/connections/${ConnectionId}`],
            query: {
              queryString: query,
            },
            from: 0,
            size: 25,
            fields: [
              "partNumber",
              "name",
              "description",
              "price",
              "inventory",
              "appliances",
            ],
          },
        ],
      };

      try {
        const credential = new TeamsUserCredential({
          initiateLoginEndpoint: config.initiateLoginEndpoint,
          clientId: config.clientId,
        });
        
        // Create an instance of the TokenCredentialAuthenticationProvider by passing the tokenCredential instance and options to the constructor
        const authProvider = new TokenCredentialAuthenticationProvider(
          credential,
          {
            scopes: Scopes,
          }
        );

        // Initialize Graph client instance with authProvider
        const graph = Client.initWithMiddleware({
          authProvider: authProvider,
        });

        const result = await graph
          .api("/search/query")
          .version("beta")
          .post(searchContent);

        let items: any[] = [];

        if (result.value[0].hitsContainers[0].total) {
          items = result.value[0].hitsContainers[0].hits;
        }
        setData(items);
        setError("");
      } catch (error) {
        setError(error);
      } finally {
        setLoading(false);
      }
    }
  }

  return (
    <div className="query page">
      <div className="section-margin">
        <h2>3. Query Data from Graph Connector</h2>
        <Input
          className="search"
          role="search"
          contentBefore={<SearchRegular />}
          placeholder="Type keyword (e.g. 'Contoso') and press 'Enter' to search"
          value={query}
          onChange={(e: any) => setQuery(e.target.value)}
          onKeyDown={(e) => search(e)}
        />
        {loading && (
          <div>
            <Spinner style={{ margin: 100 }} />
          </div>
        )}
        {!loading && !error && (
          <div>
            <Table arial-label="Static table">
              <TableHeader>
                <TableRow>
                  {columns.map((column) => (
                    <TableHeaderCell key={column.columnKey}>
                      {column.label}
                    </TableHeaderCell>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.map((item) => (
                  <TableRow key={item.resource.properties.partNumber}>
                    <TableCell>{item.resource.properties.partNumber}</TableCell>
                    <TableCell>{item.resource.properties.name}</TableCell>
                    <TableCell>
                      {item.resource.properties.description}
                    </TableCell>
                    <TableCell>{item.resource.properties.price}</TableCell>
                    <TableCell>{item.resource.properties.inventory}</TableCell>
                    <TableCell>{item.resource.properties.appliances}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
        {!loading && !!error && (
          <div className="error fixed">{error.toString()}</div>
        )}
      </div>
    </div>
  );
}
