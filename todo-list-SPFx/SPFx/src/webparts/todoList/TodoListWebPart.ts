// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import * as React from "react";
import * as ReactDom from "react-dom";
import { Version } from "@microsoft/sp-core-library";
import {
  IPropertyPaneConfiguration,
  PropertyPaneTextField,
} from "@microsoft/sp-property-pane";
import { BaseClientSideWebPart } from "@microsoft/sp-webpart-base";

import * as strings from "TodoListWebPartStrings";
import TodoList from "./components/TodoList";
import { ITodoListProps } from "./components/ITodoListProps";
import { initializeIcons } from "office-ui-fabric-react/lib/Icons";

export interface ITodoListWebPartProps {
  description: string;
}

export default class TodoListWebPart extends BaseClientSideWebPart<ITodoListWebPartProps> {
  public render(): void {
    const element: React.ReactElement<ITodoListProps> = React.createElement(
      TodoList,
      {
        description: this.properties.description,
        context: this.context,
      }
    );

    initializeIcons();
    ReactDom.render(element, this.domElement);
  }

  protected onDispose(): void {
    ReactDom.unmountComponentAtNode(this.domElement);
  }

  protected get dataVersion(): Version {
    return Version.parse("1.0");
  }

  protected getPropertyPaneConfiguration(): IPropertyPaneConfiguration {
    return {
      pages: [
        {
          header: {
            description: strings.PropertyPaneDescription,
          },
          groups: [
            {
              groupName: strings.BasicGroupName,
              groupFields: [
                PropertyPaneTextField("description", {
                  label: strings.DescriptionFieldLabel,
                }),
              ],
            },
          ],
        },
      ],
    };
  }
}
