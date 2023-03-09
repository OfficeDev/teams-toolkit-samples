import { mergeStyles } from "@fluentui/react";
import { Component, CSSProperties } from "react";

import { widgetStyle } from "./Widget.styles";

interface WidgetState {
  loading?: boolean;
}

/**
 * Defined a widget, it's also a react component.
 * For more information about react component, please refer to https://reactjs.org/docs/react-component.html
 * T is the model type of the widget.
 */
export abstract class Widget<T> extends Component<{}, T & WidgetState> {
  constructor(props: any) {
    super(props);
    type L = T & WidgetState;
    this.state = {} as L;
  }

  /**
   * This method is invoked immediately after a component is mounted.
   * It's a good place to fetch data from server.
   * For more information about react lifecycle, please refer to https://reactjs.org/docs/react-component.html#componentdidmount
   */
  async componentDidMount() {
    this.setState({ ...(await this.getData()), loading: false });
  }

  /**
   * Define your widget layout, you can edit the code here to customize your widget.
   */
  render() {
    return (
      <div className={mergeStyles(widgetStyle.root, this.genClassName())} style={this.genStyle()}>
        {this.headerContent() && <div className={widgetStyle.header}>{this.headerContent()}</div>}
        {this.state.loading !== false && this.loadingContent() !== undefined ? (
          this.loadingContent()
        ) : (
          <>
            {this.bodyContent() !== undefined && this.bodyContent()}
            {this.footerContent() !== undefined && this.footerContent()}
          </>
        )}
      </div>
    );
  }

  /**
   * Get data required by the widget, you can get data from a api call or static data stored in a file. Override this method according to your needs.
   * @returns data for the widget
   */
  protected async getData(): Promise<T> {
    return {} as T;
  }

  /**
   * Override this method to customize the widget header.
   * @returns JSX component for the widget body
   */
  protected headerContent(): JSX.Element | undefined {
    return undefined;
  }

  /**
   * Override this method to customize the widget body.
   * @returns JSX component for the widget body
   */
  protected bodyContent(): JSX.Element | undefined {
    return undefined;
  }

  /**
   * Override this method to customize the widget footer.
   * @returns react node for the widget footer
   */
  protected footerContent(): JSX.Element | undefined {
    return undefined;
  }

  /**
   * Override this method to customize what the widget will look like when it is loading.
   */
  protected loadingContent(): JSX.Element | undefined {
    return undefined;
  }

  /**
   * Override this method to customize the widget style.
   * @returns custom style for the widget
   */
  protected stylingWidget(): CSSProperties | string {
    return {};
  }

  /**
   * Construct CSSProperties object for styling the widget.
   * @returns CSSProperties object
   */
  private genStyle(): CSSProperties {
    return typeof this.stylingWidget() === "string"
      ? ({} as CSSProperties)
      : (this.stylingWidget() as CSSProperties);
  }

  /**
   * Construct className string for styling the widget.
   * @returns className for styling the widget
   */
  private genClassName(): string {
    return typeof this.stylingWidget() === "string" ? (this.stylingWidget() as string) : "";
  }
}
