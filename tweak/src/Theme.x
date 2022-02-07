#import <Foundation/Foundation.h>
#import <UIKit/UIKit.h>
#import "Aliucord.h"

NSMutableDictionary *colors;

// Convert an UIColor element to a hex string
NSString* hexStringFromColor(UIColor * color) {
  const CGFloat *components = CGColorGetComponents(color.CGColor);

  CGFloat r = components[0];
  CGFloat g = components[1];
  CGFloat b = components[2];
  CGFloat a = components[3];

  return [NSString stringWithFormat:@"#%02lX%02lX%02lX%02lX",
    lroundf(r * 255),
    lroundf(g * 255),
    lroundf(b * 255),
    lroundf(a * 255)
  ];
}

// Convert a hex color string to an UIColor element 
UIColor* colorFromHexString(NSString *hexString) {
  unsigned rgbValue = 0;
  NSScanner *scanner = [NSScanner scannerWithString:hexString];
  [scanner setScanLocation: 1];
  [scanner scanHexInt: &rgbValue];

  return [UIColor colorWithRed:((rgbValue & 0xFF0000) >> 16)/255.0 green:((rgbValue & 0xFF00) >> 8)/255.0 blue:(rgbValue & 0xFF)/255.0 alpha:1.0];
}

// Convert a RGBA color string to an UIColor element 
UIColor* colorFromRGBAString(NSString *rgbaString) {
  NSRegularExpression *rgbaRegex = [NSRegularExpression regularExpressionWithPattern:@"\\((.*)\\)" options:NSRegularExpressionCaseInsensitive error:nil];
  NSArray *matches = [rgbaRegex matchesInString:rgbaString options:0 range:NSMakeRange(0, [rgbaString length])];
  NSString *value = [[NSString alloc] init];

  for (NSTextCheckingResult *match in matches) {
    NSRange matchRange = [match rangeAtIndex:1];
    value = [rgbaString substringWithRange:matchRange];
  }

  NSArray *values = [value componentsSeparatedByString:@","];
  NSMutableArray *rgbaValues = [[NSMutableArray alloc] init];
  for (NSString* v in values) {
    NSString *trimmed = [v stringByTrimmingCharactersInSet:[NSCharacterSet whitespaceCharacterSet]];
    [rgbaValues addObject:[NSNumber numberWithFloat:[trimmed floatValue]]];
  }

  return [UIColor colorWithRed:[[rgbaValues objectAtIndex:0] floatValue]/255.0f green:[[rgbaValues objectAtIndex:1] floatValue]/255.0f blue:[[rgbaValues objectAtIndex:2] floatValue]/255.0f alpha:[[rgbaValues objectAtIndex:3] floatValue]];
}

// Load the theme 
void loadTheme() {
  if (!checkFileExists(THEME_PATH)) {
    return;
  }

  colors = [[NSMutableDictionary alloc] init];
  NSData *data = [NSData dataWithContentsOfFile:THEME_PATH];
  NSDictionary *theme = [NSJSONSerialization JSONObjectWithData:data options:kNilOptions error:nil];

  for (id key in theme) {
    id value = [theme objectForKey:key];
    [colors setObject:value forKey:key];
  }
}

// Save the theme
BOOL saveTheme(NSString *theme, NSString *json) {
  int pos = 0;
  if ([theme isEqualToString:@"dark"]) {
    pos = 1;
  }

  NSDictionary *values = [NSJSONSerialization
                          JSONObjectWithData: [json dataUsingEncoding:NSUTF8StringEncoding]
                          options:kNilOptions
                          error:nil];

  NSMutableDictionary *chatTheme = [[NSMutableDictionary alloc] init];

  for (id key in values) {
    id value = values[key][pos];
    [chatTheme setObject:value forKey:key];
  }

  NSData *chatThemeData = [NSJSONSerialization
                            dataWithJSONObject:chatTheme
                            options:kNilOptions
                            error:nil];

  BOOL success = [chatThemeData writeToFile:THEME_PATH atomically:FALSE];
  return success;
}

// Delete the theme
BOOL deleteTheme() {
  NSFileManager *fileManager = [NSFileManager defaultManager];
  NSError *err;
  [fileManager
    removeItemAtPath:THEME_PATH
    error:&err];

  if (err) {
    return false;
  }

  return true;
}

// Get a color
UIColor* getColor(NSString *name) {
  if (![colors objectForKey:name]) {
    return NULL;
  }

  NSString *value = colors[name];
  UIColor *color;

  if ([value containsString:@"rgba"]) {
    color = colorFromRGBAString(value);
  } else {
    color = colorFromHexString(value);
  }

  return color;
}

%hook DCDThemeColor

+ (id)TEXTBOX_MARKDOWN_SYNTAX {
  id original = %orig;
  id color = getColor(@"TEXTBOX_MARKDOWN_SYNTAX");

  if (color) {
    return color;
  }

  return original;
}

+ (id)ACTIVITY_CARD_BACKGROUND {
  id original = %orig;
  id color = getColor(@"ACTIVITY_CARD_BACKGROUND");

  if (color) {
    return color;
  }

  return original;
}

+ (id)CHANNELTEXTAREA_BACKGROUND {
  id original = %orig;
  id color = getColor(@"CHANNELTEXTAREA_BACKGROUND");

  if (color) {
    return color;
  }

  return original;
}

+ (id)GUILD_HEADER_TEXT_SHADOW {
  id original = %orig;
  id color = getColor(@"GUILD_HEADER_TEXT_SHADOW");

  if (color) {
    return color;
  }

  return original;
}

+ (id)CHANNELS_DEFAULT {
  id original = %orig;
  id color = getColor(@"CHANNELS_DEFAULT");

  if (color) {
    return color;
  }

  return original;
}

+ (id)BACKGROUND_MESSAGE_HOVER {
  id original = %orig;
  id color = getColor(@"BACKGROUND_MESSAGE_HOVER");

  if (color) {
    return color;
  }

  return original;
}

+ (id)BACKGROUND_MENTIONED_HOVER {
  id original = %orig;
  id color = getColor(@"BACKGROUND_MENTIONED_HOVER");

  if (color) {
    return color;
  }

  return original;
}

+ (id)BACKGROUND_MENTIONED {
  id original = %orig;
  id color = getColor(@"BACKGROUND_MENTIONED");

  if (color) {
    return color;
  }

  return original;
}

+ (id)CONTROL_BRAND_FOREGROUND_NEW {
  id original = %orig;
  id color = getColor(@"CONTROL_BRAND_FOREGROUND_NEW");

  if (color) {
    return color;
  }

  return original;
}

+ (id)CONTROL_BRAND_FOREGROUND {
  id original = %orig;
  id color = getColor(@"CONTROL_BRAND_FOREGROUND");

  if (color) {
    return color;
  }

  return original;
}

+ (id)FOCUS_PRIMARY {
  id original = %orig;
  id color = getColor(@"FOCUS_PRIMARY");

  if (color) {
    return color;
  }

  return original;
}

+ (id)LOGO_PRIMARY {
  id original = %orig;
  id color = getColor(@"LOGO_PRIMARY");

  if (color) {
    return color;
  }

  return original;
}

+ (id)ELEVATION_HIGH {
  id original = %orig;
  id color = getColor(@"ELEVATION_HIGH");

  if (color) {
    return color;
  }

  return original;
}

+ (id)ELEVATION_MEDIUM {
  id original = %orig;
  id color = getColor(@"ELEVATION_MEDIUM");

  if (color) {
    return color;
  }

  return original;
}

+ (id)ELEVATION_LOW {
  id original = %orig;
  id color = getColor(@"ELEVATION_LOW");

  if (color) {
    return color;
  }

  return original;
}

+ (id)ELEVATION_STROKE {
  id original = %orig;
  id color = getColor(@"ELEVATION_STROKE");

  if (color) {
    return color;
  }

  return original;
}

+ (id)SCROLLBAR_AUTO_SCROLLBAR_COLOR_TRACK {
  id original = %orig;
  id color = getColor(@"SCROLLBAR_AUTO_SCROLLBAR_COLOR_TRACK");

  if (color) {
    return color;
  }

  return original;
}

+ (id)SCROLLBAR_AUTO_SCROLLBAR_COLOR_THUMB {
  id original = %orig;
  id color = getColor(@"SCROLLBAR_AUTO_SCROLLBAR_COLOR_THUMB");

  if (color) {
    return color;
  }

  return original;
}

+ (id)SCROLLBAR_AUTO_TRACK {
  id original = %orig;
  id color = getColor(@"SCROLLBAR_AUTO_TRACK");

  if (color) {
    return color;
  }

  return original;
}

+ (id)SCROLLBAR_AUTO_THUMB {
  id original = %orig;
  id color = getColor(@"SCROLLBAR_AUTO_THUMB");

  if (color) {
    return color;
  }

  return original;
}

+ (id)SCROLLBAR_THIN_TRACK {
  id original = %orig;
  id color = getColor(@"SCROLLBAR_THIN_TRACK");

  if (color) {
    return color;
  }

  return original;
}

+ (id)SCROLLBAR_THIN_THUMB {
  id original = %orig;
  id color = getColor(@"SCROLLBAR_THIN_THUMB");

  if (color) {
    return color;
  }

  return original;
}

+ (id)STATUS_DANGER_TEXT {
  id original = %orig;
  id color = getColor(@"STATUS_DANGER_TEXT");

  if (color) {
    return color;
  }

  return original;
}

+ (id)STATUS_DANGER_BACKGROUND {
  id original = %orig;
  id color = getColor(@"STATUS_DANGER_BACKGROUND");

  if (color) {
    return color;
  }

  return original;
}

+ (id)STATUS_WARNING_TEXT {
  id original = %orig;
  id color = getColor(@"STATUS_WARNING_TEXT");

  if (color) {
    return color;
  }

  return original;
}

+ (id)STATUS_WARNING_BACKGROUND {
  id original = %orig;
  id color = getColor(@"STATUS_WARNING_BACKGROUND");

  if (color) {
    return color;
  }

  return original;
}

+ (id)STATUS_POSITIVE_TEXT {
  id original = %orig;
  id color = getColor(@"STATUS_POSITIVE_TEXT");

  if (color) {
    return color;
  }

  return original;
}

+ (id)STATUS_POSITIVE_BACKGROUND {
  id original = %orig;
  id color = getColor(@"STATUS_POSITIVE_BACKGROUND");

  if (color) {
    return color;
  }

  return original;
}

+ (id)INFO_HELP_TEXT {
  id original = %orig;
  id color = getColor(@"INFO_HELP_TEXT");

  if (color) {
    return color;
  }

  return original;
}

+ (id)INFO_HELP_FOREGROUND {
  id original = %orig;
  id color = getColor(@"INFO_HELP_FOREGROUND");

  if (color) {
    return color;
  }

  return original;
}

+ (id)INFO_HELP_BACKGROUND {
  id original = %orig;
  id color = getColor(@"INFO_HELP_BACKGROUND");

  if (color) {
    return color;
  }

  return original;
}

+ (id)INFO_DANGER_TEXT {
  id original = %orig;
  id color = getColor(@"INFO_DANGER_TEXT");

  if (color) {
    return color;
  }

  return original;
}

+ (id)INFO_DANGER_FOREGROUNG {
  id original = %orig;
  id color = getColor(@"INFO_DANGER_FOREGROUNG");

  if (color) {
    return color;
  }

  return original;
}

+ (id)INFO_DANGER_BACKGROUND {
  id original = %orig;
  id color = getColor(@"INFO_DANGER_BACKGROUND");

  if (color) {
    return color;
  }

  return original;
}

+ (id)INFO_WARNING_TEXT {
  id original = %orig;
  id color = getColor(@"INFO_WARNING_TEXT");

  if (color) {
    return color;
  }

  return original;
}

+ (id)INFO_WARNING_FOREGROUND {
  id original = %orig;
  id color = getColor(@"INFO_WARNING_FOREGROUND");

  if (color) {
    return color;
  }

  return original;
}

+ (id)INFO_WARNING_BACKGROUND {
  id original = %orig;
  id color = getColor(@"INFO_WARNING_BACKGROUND");

  if (color) {
    return color;
  }

  return original;
}

+ (id)INFO_POSITIVE_TEXT {
  id original = %orig;
  id color = getColor(@"INFO_POSITIVE_TEXT");

  if (color) {
    return color;
  }

  return original;
}

+ (id)INFO_POSITIVE_FOREGROUND {
  id original = %orig;
  id color = getColor(@"INFO_POSITIVE_FOREGROUND");

  if (color) {
    return color;
  }

  return original;
}

+ (id)INFO_POSITIVE_BACKGROUND {
  id original = %orig;
  id color = getColor(@"INFO_POSITIVE_BACKGROUND");

  if (color) {
    return color;
  }

  return original;
}

+ (id)BACKGROUND_MODIFIER_ACCENT {
  id original = %orig;
  id color = getColor(@"BACKGROUND_MODIFIER_ACCENT");

  if (color) {
    return color;
  }

  return original;
}

+ (id)BACKGROUND_MODIFIER_SELECTED {
  id original = %orig;
  id color = getColor(@"BACKGROUND_MODIFIER_SELECTED");

  if (color) {
    return color;
  }

  return original;
}

+ (id)BACKGROUND_MODIFIER_ACTIVE {
  id original = %orig;
  id color = getColor(@"BACKGROUND_MODIFIER_ACTIVE");

  if (color) {
    return color;
  }

  return original;
}

+ (id)BACKGROUND_MODIFIER_HOVER {
  id original = %orig;
  id color = getColor(@"BACKGROUND_MODIFIER_HOVER");

  if (color) {
    return color;
  }

  return original;
}

+ (id)BACKGROUND_MOBILE_SECONDARY {
  id original = %orig;
  id color = getColor(@"BACKGROUND_MOBILE_SECONDARY");

  if (color) {
    return color;
  }

  return original;
}

+ (id)BACKGROUND_MOBILE_PRIMARY {
  id original = %orig;
  id color = getColor(@"BACKGROUND_MOBILE_PRIMARY");

  if (color) {
    return color;
  }

  return original;
}

+ (id)BACKGROUND_FLOATING {
  id original = %orig;
  id color = getColor(@"BACKGROUND_FLOATING");

  if (color) {
    return color;
  }

  return original;
}

+ (id)BACKGROUND_ACCENT {
  id original = %orig;
  id color = getColor(@"BACKGROUND_ACCENT");

  if (color) {
    return color;
  }

  return original;
}

+ (id)BACKGROUND_TERTIARY {
  id original = %orig;
  id color = getColor(@"BACKGROUND_TERTIARY");

  if (color) {
    return color;
  }

  return original;
}

+ (id)BACKGROUND_SECONDARY_ALT {
  id original = %orig;
  id color = getColor(@"BACKGROUND_SECONDARY_ALT");

  if (color) {
    return color;
  }

  return original;
}

+ (id)BACKGROUND_SECONDARY {
  id original = %orig;
  id color = getColor(@"BACKGROUND_SECONDARY");

  if (color) {
    return color;
  }

  return original;
}

+ (id)BACKGROUND_PRIMARY {
  id original = %orig;
  id color = getColor(@"BACKGROUND_PRIMARY");

  if (color) {
    return color;
  }

  return original;
}

+ (id)INTERACTIVE_MUTED {
  id original = %orig;
  id color = getColor(@"INTERACTIVE_MUTED");

  if (color) {
    return color;
  }

  return original;
}

+ (id)INTERACTIVE_ACTIVE {
  id original = %orig;
  id color = getColor(@"INTERACTIVE_ACTIVE");

  if (color) {
    return color;
  }

  return original;
}

+ (id)INTERACTIVE_HOVER {
  id original = %orig;
  id color = getColor(@"INTERACTIVE_HOVER");

  if (color) {
    return color;
  }

  return original;
}

+ (id)INTERACTIVE_NORMAL {
  id original = %orig;
  id color = getColor(@"INTERACTIVE_NORMAL");

  if (color) {
    return color;
  }

  return original;
}

+ (id)TEXT_BRAND {
  id original = %orig;
  id color = getColor(@"TEXT_BRAND");

  if (color) {
    return color;
  }

  return original;
}

+ (id)TEXT_DANGER {
  id original = %orig;
  id color = getColor(@"TEXT_DANGER");

  if (color) {
    return color;
  }

  return original;
}

+ (id)TEXT_WARNING {
  id original = %orig;
  id color = getColor(@"TEXT_WARNING");

  if (color) {
    return color;
  }

  return original;
}

+ (id)TEXT_POSITIVE {
  id original = %orig;
  id color = getColor(@"TEXT_POSITIVE");

  if (color) {
    return color;
  }

  return original;
}

+ (id)TEXT_LINK_LOW_SATURATION {
  id original = %orig;
  id color = getColor(@"TEXT_LINK_LOW_SATURATION");

  if (color) {
    return color;
  }

  return original;
}

+ (id)TEXT_LINK {
  id original = %orig;
  id color = getColor(@"TEXT_LINK");

  if (color) {
    return color;
  }

  return original;
}

+ (id)TEXT_MUTED {
  id original = %orig;
  id color = getColor(@"TEXT_MUTED");

  if (color) {
    return color;
  }

  return original;
}

+ (id)TEXT_NORMAL {
  id original = %orig;
  id color = getColor(@"TEXT_NORMAL");

  if (color) {
    return color;
  }

  return original;
}

+ (id)HEADER_SECONDARY {
  id original = %orig;
  id color = getColor(@"HEADER_SECONDARY");

  if (color) {
    return color;
  }

  return original;
}

+ (id)HEADER_PRIMARY {
  id original = %orig;
  id color = getColor(@"HEADER_PRIMARY");

  if (color) {
    return color;
  }

  return original;
}

%end

%ctor {
  loadTheme();
}