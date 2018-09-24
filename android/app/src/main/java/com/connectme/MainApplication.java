package com.connectme;

import android.app.Application;
import com.apptentive.android.sdk.reactlibrary.RNApptentivePackage;
import com.surajit.rnrg.RNRadialGradientPackage;
import com.facebook.react.ReactApplication;
import rnpbkdf2.PBKDF2Package;
import io.sentry.RNSentryPackage;
import io.invertase.firebase.RNFirebasePackage;
import io.invertase.firebase.messaging.RNFirebaseMessagingPackage;
import io.invertase.firebase.notifications.RNFirebaseNotificationsPackage;
import com.rnziparchive.RNZipArchivePackage;
import com.bitgo.randombytes.RandomBytesPackage;
import com.reactnativedocumentpicker.ReactNativeDocumentPicker;
import br.com.classapp.RNSensitiveInfo.RNSensitiveInfoPackage;
import cl.json.RNSharePackage;
import cl.json.ShareApplication;
import com.apsl.versionnumber.RNVersionNumberPackage;
import com.reactnative.ivpusic.imagepicker.PickerPackage;
import com.reactnative.ivpusic.imagepicker.PickerPackage;
import fr.bamlab.rnimageresizer.ImageResizerPackage;
import com.rnfingerprint.FingerprintAuthPackage;
//import com.horcrux.svg.SvgPackage;
import com.RNFetchBlob.RNFetchBlobPackage;
import com.lwansbrough.RCTCamera.RCTCameraPackage;
import io.branch.rnbranch.RNBranchPackage;
import io.branch.referral.Branch;
import com.oblador.vectoricons.VectorIconsPackage;
import org.devio.rn.splashscreen.SplashScreenReactPackage;
import com.connectme.rnindy.RNIndyPackage;
import com.facebook.react.ReactNativeHost;
import com.facebook.react.ReactPackage;
import com.facebook.react.shell.MainReactPackage;
import com.facebook.soloader.SoLoader;

import java.util.Arrays;
import java.util.List;

//import com.oblador.vectoricons.VectorIconsPackage;

public class MainApplication extends Application implements ShareApplication, ReactApplication {

  private final ReactNativeHost mReactNativeHost = new ReactNativeHost(this) {
    @Override
    public boolean getUseDeveloperSupport() {
      return BuildConfig.DEBUG;
    }

    @Override
    protected List<ReactPackage> getPackages() {
      return Arrays.<ReactPackage>asList(
        new MainReactPackage(),
            new PBKDF2Package(),
        new RNSentryPackage(),
        new RNFirebasePackage(),
        new RNFirebaseNotificationsPackage(),
        new RNFirebaseMessagingPackage(),
        new RNZipArchivePackage(),
        new RandomBytesPackage(),
        new ReactNativeDocumentPicker(),
        new RNSensitiveInfoPackage(),
        new RNSharePackage(),
        new RNVersionNumberPackage(),
        new PickerPackage(),
        new ImageResizerPackage(),
        new FingerprintAuthPackage(),
        new RNFetchBlobPackage(),
        new RCTCameraPackage(),
        new RNBranchPackage(),
        new VectorIconsPackage(),
        new SplashScreenReactPackage(),
        new RNIndyPackage(),
        new RNRadialGradientPackage(),
        new RNApptentivePackage()
      );
    }

    @Override
    protected String getJSMainModuleName() {

      return "index";
    }
  };

  @Override
  public ReactNativeHost getReactNativeHost() {

    return mReactNativeHost;
  }

  @Override
  public void onCreate() {
    super.onCreate();
    Branch.getAutoInstance(this);
    SoLoader.init(this, /* native exopackage */ false);
  }

  @Override
  public String getFileProviderAuthority() {
    return "com.connectme.provider";
  }
}
