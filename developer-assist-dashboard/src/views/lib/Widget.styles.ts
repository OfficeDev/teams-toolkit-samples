import { tokens } from "@fluentui/react-components";
import { mergeStyleSets } from "@fluentui/react";

export const widgetStyle = mergeStyleSets({
    root: {
        display: "grid",
        padding: "0.75rem 1.25rem 1rem 1.25rem",
        backgroundColor: tokens.colorNeutralBackground1,
        borderWidth: "1px",
        borderStyle: "solid",
        borderColor: tokens.colorTransparentStroke,
        boxShadow: tokens.shadow4,
        borderRadius: tokens.borderRadiusMedium,
        gap: "1rem",
        gridTemplateRows: "max-content 1fr max-content",
    },
    header: {
        display: "grid",
        alignItems: "center",
        height: "max-content",
    },
    headerWithoutIcon: {
        display: "grid",
        gap: "8px",
        gridTemplateColumns: "1fr min-content",
        alignItems: "center",
    },
    headerContent: {
        display: "grid",
        gap: "8px",
        gridTemplateColumns: "max-content 1fr min-content",
        alignItems: "center",
    },
    headerText: {
        fontWeight: "600 !important",
        lineHeight: "1rem !important",
        fontSize: "0.75rem !important",
    },
    footerBtn: {
        width: "fit-content",
        color: "var(--colorBrandForeground1) !important",
        paddingLeft: "0.25rem !important",
        paddingRight: "0 !important",
    },
});
