// -*- mode: java; c-basic-offset: 2; -*-
// Copyright 2011-2015 MIT, All rights reserved
// Released under the Apache License, Version 2.0
// http://www.apache.org/licenses/LICENSE-2.0

package com.google.appinventor.components.runtime;

import com.google.appinventor.components.annotations.DesignerComponent;
import com.google.appinventor.components.annotations.PropertyCategory;
import com.google.appinventor.components.annotations.SimpleFunction;
import com.google.appinventor.components.annotations.SimpleObject;
import com.google.appinventor.components.annotations.SimpleProperty;
import com.google.appinventor.components.annotations.UsesLibraries;
import com.google.appinventor.components.common.ComponentCategory;
import com.google.appinventor.components.common.YaVersion;
import com.google.appinventor.components.runtime.util.ErrorMessages;

import com.qualcomm.robotcore.hardware.HardwareMap;
import com.qualcomm.robotcore.hardware.IrSeekerSensor;
import com.qualcomm.robotcore.hardware.IrSeekerSensor.IrSeekerIndividualSensor;
import com.qualcomm.robotcore.hardware.IrSeekerSensor.Mode;

/**
 * A component for an IR seeker sensor of an FTC robot.
 *
 * @author lizlooney@google.com (Liz Looney)
 */
@DesignerComponent(version = YaVersion.FTC_IR_SEEKER_SENSOR_COMPONENT_VERSION,
    description = "A component for an IR seeker sensor of an FTC robot.",
    category = ComponentCategory.FIRSTTECHCHALLENGE,
    nonVisible = true,
    iconName = "images/ftc.png")
@SimpleObject
@UsesLibraries(libraries = "FtcRobotCore.jar")
public final class FtcIrSeekerSensor extends FtcHardwareDevice {

  private volatile IrSeekerSensor irSeekerSensor;

  /**
   * Creates a new FtcIrSeekerSensor component.
   */
  public FtcIrSeekerSensor(ComponentContainer container) {
    super(container.$form());
  }

  /**
   * Mode_600HZ_DC property getter.
   */
  @SimpleProperty(description = "The constant for Mode_600HZ_DC.",
      category = PropertyCategory.BEHAVIOR)
  public String Mode_600HZ_DC() {
    return Mode.MODE_600HZ_DC.toString();
  }

  /**
   * Mode_1200HZ_AC property getter.
   */
  @SimpleProperty(description = "The constant for Mode_1200HZ_AC.",
      category = PropertyCategory.BEHAVIOR)
  public String Mode_1200HZ_AC() {
    return Mode.MODE_1200HZ_AC.toString();
  }

  /**
   * Mode property setter.
   */
  @SimpleProperty
  public void Mode(String modeString) {
    if (irSeekerSensor != null) {
      try {
        for (Mode mode : Mode.values()) {
          if (mode.toString().equalsIgnoreCase(modeString)) {
            irSeekerSensor.setMode(mode);
            return;
          }
        }

        form.dispatchErrorOccurredEvent(this, "Mode",
            ErrorMessages.ERROR_FTC_INVALID_IR_SEEKER_SENSOR_MODE, modeString);
      } catch (Throwable e) {
        e.printStackTrace();
        form.dispatchErrorOccurredEvent(this, "Mode",
            ErrorMessages.ERROR_FTC_UNEXPECTED_ERROR, e.toString());
      }
    }
  }

  /**
   * Mode property getter.
   */
  @SimpleProperty(description = "The mode of the IR seeker sensor; MODE_600HZ_DC or MODE_1200HZ_AC.",
      category = PropertyCategory.BEHAVIOR)
  public String Mode() {
    if (irSeekerSensor != null) {
      try {
        Mode mode = irSeekerSensor.getMode();
        if (mode != null) {
          return mode.toString();
        }
      } catch (Throwable e) {
        e.printStackTrace();
        form.dispatchErrorOccurredEvent(this, "Mode",
            ErrorMessages.ERROR_FTC_UNEXPECTED_ERROR, e.toString());
      }
    }
    return "";
  }

  /**
   * SignalDetected property getter.
   */
  @SimpleProperty(description = "Whether a signal is detected by the sensor.",
      category = PropertyCategory.BEHAVIOR)
  public boolean SignalDetected() {
    if (irSeekerSensor != null) {
      try {
        return irSeekerSensor.signalDetected();
      } catch (Throwable e) {
        e.printStackTrace();
        form.dispatchErrorOccurredEvent(this, "SignalDetected",
            ErrorMessages.ERROR_FTC_UNEXPECTED_ERROR, e.toString());
      }
    }
    return false;
  }

  /**
   * Angle property getter.
   */
  @SimpleProperty(description = "The Angle.",
      category = PropertyCategory.BEHAVIOR)
  public double Angle() {
    if (irSeekerSensor != null) {
      try {
        if (irSeekerSensor.signalDetected()) {
          return irSeekerSensor.getAngle();
        }
      } catch (Throwable e) {
        e.printStackTrace();
        form.dispatchErrorOccurredEvent(this, "Angle",
            ErrorMessages.ERROR_FTC_UNEXPECTED_ERROR, e.toString());
      }
    }
    return 0;
  }

  /**
   * Strength property getter.
   */
  @SimpleProperty(description = "The Strength.",
      category = PropertyCategory.BEHAVIOR)
  public double Strength() {
    if (irSeekerSensor != null) {
      try {
        if (irSeekerSensor.signalDetected()) {
          return irSeekerSensor.getStrength();
        }
      } catch (Throwable e) {
        e.printStackTrace();
        form.dispatchErrorOccurredEvent(this, "Strength",
            ErrorMessages.ERROR_FTC_UNEXPECTED_ERROR, e.toString());
      }
    }
    return 0;
  }

  /**
   * SensorCount property getter.
   */
  @SimpleProperty(description = "The number of individual IR sensors attached to this seeker.",
      category = PropertyCategory.BEHAVIOR)
  public int IndividualSensorCount() {
    if (irSeekerSensor != null) {
      try {
        IrSeekerIndividualSensor[] sensors = irSeekerSensor.getIndividualSensors();
        if (sensors != null) {
          return sensors.length;
        }
      } catch (Throwable e) {
        e.printStackTrace();
        form.dispatchErrorOccurredEvent(this, "IndividualSensorCount",
            ErrorMessages.ERROR_FTC_UNEXPECTED_ERROR, e.toString());
      }
    }
    return 0;
  }

  @SimpleFunction(description = "The angle of the individual IR sensor with the given " +
      "zero-based position.")
  public double IndividualSensorAngle(int position) {
    if (irSeekerSensor != null) {
      try {
        IrSeekerIndividualSensor[] sensors = irSeekerSensor.getIndividualSensors();
        if (sensors != null) {
          if (position >= 0 && position < sensors.length) {
            return sensors[position].getSensorAngle();
          } else {
            form.dispatchErrorOccurredEvent(this, "SensorAngle",
                ErrorMessages.ERROR_FTC_INVALID_POSITION, "position", position);
          }
        }
      } catch (Throwable e) {
        e.printStackTrace();
        form.dispatchErrorOccurredEvent(this, "IndividualSensorAngle",
            ErrorMessages.ERROR_FTC_UNEXPECTED_ERROR, e.toString());
      }
    }
    return 0;
  }

  @SimpleFunction(description = "The strength of the individual IR sensor with the given " +
      "zero-based position.")
  public double IndividualSensorStrength(int position) {
    if (irSeekerSensor != null) {
      try {
        IrSeekerIndividualSensor[] sensors = irSeekerSensor.getIndividualSensors();
        if (sensors != null) {
          if (position >= 0 && position < sensors.length) {
            return sensors[position].getSensorStrength();
          } else {
            form.dispatchErrorOccurredEvent(this, "IndividualSensorStrength",
                ErrorMessages.ERROR_FTC_INVALID_POSITION, "position", position);
          }
        }
      } catch (Throwable e) {
        e.printStackTrace();
        form.dispatchErrorOccurredEvent(this, "IndividualSensorStrength",
            ErrorMessages.ERROR_FTC_UNEXPECTED_ERROR, e.toString());
      }
    }
    return 0;
  }

  // FtcRobotController.HardwareDevice implementation

  @Override
  public Object initHardwareDeviceImpl(HardwareMap hardwareMap) {
    if (hardwareMap != null) {
      irSeekerSensor = hardwareMap.irSeekerSensor.get(getDeviceName());
      if (irSeekerSensor == null) {
        deviceNotFound("IrSeekerSensor", hardwareMap.irSeekerSensor);
      }
    }
    return irSeekerSensor;
  }

  @Override
  public void clearHardwareDevice() {
    irSeekerSensor = null;
  }
}
