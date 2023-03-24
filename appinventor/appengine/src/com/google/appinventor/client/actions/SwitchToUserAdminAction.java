package com.google.appinventor.client.actions;

import com.google.appinventor.client.Ode;
import com.google.gwt.user.client.Command;

public class SwitchToUserAdminAction implements Command {
  @Override
  public void execute() {
    Ode.getInstance().switchToUserAdminPanel();
  }
}