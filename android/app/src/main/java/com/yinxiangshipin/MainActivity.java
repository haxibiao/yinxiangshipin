package com.yinxiangshipin;

import android.os.Bundle;
import com.facebook.react.ReactActivity;
// rn SplashScreen
import org.devio.rn.splashscreen.SplashScreen;
// react-native-gesture-handler
import com.facebook.react.ReactActivityDelegate;
import com.facebook.react.ReactRootView;
import com.swmansion.gesturehandler.react.RNGestureHandlerEnabledRootView;

public class MainActivity extends ReactActivity {

  /**
   * Returns the name of the main component registered from JavaScript. This is used to schedule
   * rendering of the component.
   */
  @Override
  protected String getMainComponentName() {
    return "yinxiangshipin";
  }

  protected void onCreate(Bundle savedInstanceState) {
    SplashScreen.show(this, R.style.SplashScreenTheme);
    super.onCreate(savedInstanceState);
  }

  // react-native-gesture-handler
  @Override
  protected ReactActivityDelegate createReactActivityDelegate() {
      return new ReactActivityDelegate(this, getMainComponentName()) {
      @Override
      protected ReactRootView createRootView() {
          return new RNGestureHandlerEnabledRootView(MainActivity.this);
      }
    };
  }

}
