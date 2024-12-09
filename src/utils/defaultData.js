// Current version of the data structure
export const CURRENT_VERSION = '1.0.1';

export const defaultData = {
    version: CURRENT_VERSION,
    activeTabIndex: 0,
    tabCount: 1,
    tabs: [
        {
            title: "KPI 1",
            categories: [
                {
                    title: "Category 1",
                    patterns: ["Sub Category 1", "Sub Category 2"]
                },
                {
                    title: "Category 2",
                    patterns: ["Sub Category 3", "Sub Category 4"]
                }
            ]
        }
    ]
};