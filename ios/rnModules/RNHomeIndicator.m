//
//  RNHomeIndicator.m
//  yinxiangshipin
//
//  Created by lzp on 2020/11/13.
//
#import <UIKit/UIKit.h>
#import <Foundation/Foundation.h>
#import <React/RCTBridgeModule.h>
#import "RootViewController.h"

@interface RNHomeIndicator : NSObject<RCTBridgeModule>

@end


@implementation RNHomeIndicator

RCT_EXPORT_MODULE()

RCT_EXPORT_METHOD(setAutoHidden:(BOOL) hidden)
{
  UIViewController *_rootViewController = [UIApplication sharedApplication].delegate.window.rootViewController;
  RootViewController *rootViewController = (RootViewController *)_rootViewController;
  rootViewController.autoHidden = hidden;
  if (@available (iOS 11.0,*)){
    [rootViewController setNeedsUpdateOfHomeIndicatorAutoHidden];
  }
}

- (dispatch_queue_t)methodQueue{
  return dispatch_get_main_queue();
}
@end
