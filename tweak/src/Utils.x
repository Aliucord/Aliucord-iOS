#import "Aliucord.h"

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