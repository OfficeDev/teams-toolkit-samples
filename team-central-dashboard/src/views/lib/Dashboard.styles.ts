import { mergeStyles } from "@fluentui/react";

/**
 * Defines the styles for the Dashboard component.
 *
 * @param isMobile Indicates whether the component is rendered on a mobile device.
 * @param rowHeighs The value is a string that can be split by a space character to define the height of each row. For example, "100px 200px 300px" defines three rows with the first row being 100px, the second row being 200px, and the third row being 300px.
 * @param columnWidths The value is a string that can be split by a space character to define the width of each column. For example, "1fr 2fr 2fr" defines three columns with the first column occupying 20% of the available space, the second and third columns each occupying 40% of the available space.
 * @returns The styles for the Dashboard component.
 */
export const dashboardStyle = (isMobile?: boolean, rowHeighs?: string, columnWidths?: string) => {
    return mergeStyles({
        display: "grid",
        gap: "20px",
        padding: "20px",
        ...(rowHeighs !== undefined
            ? { gridTemplateRows: rowHeighs }
            : { gridTemplateRows: "1fr" }),
        ...(columnWidths !== undefined
            ? { gridTemplateColumns: columnWidths }
            : { gridTemplateColumns: "4fr 6fr" }),
        ...(isMobile === true ? { gridTemplateColumns: "1fr", gridTemplateRows: "1fr" } : {}),
    });
};

/**
 * A method can be used to achieve a column layout.
 *
 * @param heights The value is a string that can be split by a space character to define the height of each row. For example, "100px 200px 300px" defines three rows with the first row being 100px, the second row being 200px, and the third row being 300px.
 * @param width The width of the column.
 * @returns The styles for the column.
 */
export const oneColumn = (heights?: string, width?: string): string => {
    return mergeStyles({
        display: "grid",
        gap: "20px",
        ...(heights !== undefined ? { gridTemplateRows: heights } : {}),
        ...(width !== undefined ? { gridTemplateColumns: width } : { gridTemplateColumns: "1fr" }),
    });
};
