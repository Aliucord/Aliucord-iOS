#import "Aliucord.h"

// Check for update
BOOL checkForUpdate() {
  NSMutableURLRequest *aliucordFile = [NSMutableURLRequest requestWithURL:[NSURL URLWithString:ALIUCORD_URL]];
  NSHTTPURLResponse *response;
  NSError *err;

  [aliucordFile setValue:@"HEAD" forKey:@"HTTPMethod"];
  [NSURLConnection sendSynchronousRequest:aliucordFile returningResponse:&response error:&err];

  if (err) {
    return false;
  }

  if ([response respondsToSelector:@selector(allHeaderFields)]) {
    NSDictionary *headers = [response allHeaderFields];
    NSString *lastModified = [headers valueForKey:@"Last-Modified"];

    NSUserDefaults *userDefaults = [NSUserDefaults standardUserDefaults];
    NSString *aliucordVersion = [userDefaults stringForKey:@"aliucord-version"];

    if (!aliucordVersion || ![aliucordVersion isEqualToString:lastModified]) {
      [userDefaults setObject:lastModified forKey:@"aliucord-version"];
      return true;
    }
  }

  return false;
}

// Download a file 
BOOL downloadFile(NSString *source, NSString *dest) {
	NSURL *url = [NSURL URLWithString:source];
  NSLog(@"downloadFile -> url: %@", url.absoluteString);
	NSData *data = [NSData dataWithContentsOfURL:url];

	if (data) {
		[data writeToFile:dest atomically:YES];
    return true;
	}

  return false;
}

// Check if a file exists
BOOL checkFileExists(NSString *path) {
  NSFileManager *fileManager = [NSFileManager defaultManager];
  return [fileManager fileExistsAtPath:path];
}

// Create an alert prompt
void alert(NSString *message) {
  UIAlertController *alert = [UIAlertController
                                alertControllerWithTitle:@"Alert"
                                message:message
                                preferredStyle:UIAlertControllerStyleAlert];

  UIAlertAction *confirmButton = [UIAlertAction
                                    actionWithTitle:@"Ok"
                                    style:UIAlertActionStyleDefault
                                    handler:nil];

  [alert addAction:confirmButton];

  UIViewController *viewController = [[[[UIApplication sharedApplication] delegate] window] rootViewController];
  [viewController presentViewController:alert animated:YES completion:nil];
}

// Create a confirmation prompt
void confirm(NSString *title, NSString *message, void (^confirmed)(void)) {
  UIAlertController *alert = [UIAlertController
                                  alertControllerWithTitle:title
                                  message:message
                                  preferredStyle:UIAlertControllerStyleAlert];

  UIAlertAction *confirmButton = [UIAlertAction
                                    actionWithTitle:@"Confirm"
                                    style:UIAlertActionStyleDefault
                                    handler:^(UIAlertAction *action) {
                                      confirmed();
                                    }];

  UIAlertAction *cancelButton = [UIAlertAction
                                  actionWithTitle:@"Cancel"
                                  style:UIAlertActionStyleCancel
                                  handler:nil];

  [alert addAction:cancelButton];
  [alert addAction:confirmButton];

  UIViewController *viewController = [[[[UIApplication sharedApplication] delegate] window] rootViewController];
  [viewController presentViewController:alert animated:YES completion:nil];
}

// Inject code into Discord
void injectCode(NSString *code) {
  UIWindow *window = [[[UIApplication sharedApplication] delegate] window];
  RCTRootView *rootView = (RCTRootView *)window.rootViewController.view;
  RCTCxxBridge *bridge = rootView.bridge.batchedBridge;

  NSData *sourceCodeData = [code dataUsingEncoding:NSUTF8StringEncoding];

  [bridge executeApplicationScript:sourceCodeData url:[NSURL URLWithString:@"tweak"] async:false];
}