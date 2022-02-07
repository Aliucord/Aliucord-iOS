#define THEME_PATH [NSString stringWithFormat:@"%@/%@", NSHomeDirectory(), @"Documents/theme.json"]

void loadTheme();
BOOL saveTheme(NSString *theme, NSString *json);
BOOL deleteTheme();