//
//  RootViewController.m
//  yinxiangshipin
//
//  Created by lzp on 2020/11/13.
//

#import "RootViewController.h"

@interface RootViewController ()

@end

@implementation RootViewController

- (instancetype) init {
  if (self = [super init]){
    self.autoHidden = false;
  }
  return self;
}

- (BOOL)prefersHomeIndicatorAutoHidden {
  return _autoHidden;
}
- (BOOL)prefersStatusBarHidden{
  return NO;
}

- (void)viewDidLoad {
    [super viewDidLoad];
}
- (BOOL)shouldAutorotate {
  return true;
}
- (UIInterfaceOrientationMask)supportedInterfaceOrientations
{
  return UIInterfaceOrientationMaskAllButUpsideDown;
}

@end
