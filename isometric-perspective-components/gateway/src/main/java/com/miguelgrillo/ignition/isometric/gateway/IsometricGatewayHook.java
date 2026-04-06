package com.miguelgrillo.ignition.isometric.gateway;

import java.util.Optional;
import com.inductiveautomation.ignition.common.licensing.LicenseState;
import com.inductiveautomation.ignition.common.util.LoggerEx;
import com.inductiveautomation.ignition.gateway.model.AbstractGatewayModuleHook;
import com.inductiveautomation.ignition.gateway.model.GatewayContext;
import com.inductiveautomation.perspective.common.api.ComponentRegistry;
import com.inductiveautomation.perspective.gateway.api.PerspectiveContext;
import com.miguelgrillo.ignition.isometric.common.IsometricComponents;
import com.miguelgrillo.ignition.isometric.common.comp.Custom2DBreakerClosed;
import com.miguelgrillo.ignition.isometric.common.comp.Custom2DBreakerOpen;
import com.miguelgrillo.ignition.isometric.common.comp.Custom2DBusbarHIntersection;
import com.miguelgrillo.ignition.isometric.common.comp.Custom2DBusbarHTeeDown;
import com.miguelgrillo.ignition.isometric.common.comp.Custom2DBusbarHTeeLeft;
import com.miguelgrillo.ignition.isometric.common.comp.Custom2DBusbarHTeeRight;
import com.miguelgrillo.ignition.isometric.common.comp.Custom2DBusbarHTeeUp;
import com.miguelgrillo.ignition.isometric.common.comp.Custom2DBusbarHEnergized;
import com.miguelgrillo.ignition.isometric.common.comp.Custom2DBusbarSegment;
import com.miguelgrillo.ignition.isometric.common.comp.Custom2DBusbarSegmentVertical;
import com.miguelgrillo.ignition.isometric.common.comp.Custom2DBusbarSVIntersection;
import com.miguelgrillo.ignition.isometric.common.comp.Custom2DBusbarSVTeeDown;
import com.miguelgrillo.ignition.isometric.common.comp.Custom2DBusbarSVTeeLeft;
import com.miguelgrillo.ignition.isometric.common.comp.Custom2DBusbarSVTeeRight;
import com.miguelgrillo.ignition.isometric.common.comp.Custom2DBusbarSVTeeUp;
import com.miguelgrillo.ignition.isometric.common.comp.Custom2DBusbarVEnergized;
import com.miguelgrillo.ignition.isometric.common.comp.Custom2DCircuitBreakerModern;
import com.miguelgrillo.ignition.isometric.common.comp.Custom2DControlValveModern;
import com.miguelgrillo.ignition.isometric.common.comp.Custom2DGensetClosed;
import com.miguelgrillo.ignition.isometric.common.comp.Custom2DGensetOpen;
import com.miguelgrillo.ignition.isometric.common.comp.Custom2DGensetSync;
import com.miguelgrillo.ignition.isometric.common.comp.Custom2DLvBreakerScreenFullPage;
import com.miguelgrillo.ignition.isometric.common.comp.Custom2DMvGensetScreenMain;
import com.miguelgrillo.ignition.isometric.common.comp.Custom2DModernGensetPanelV7FullPanel;
import com.miguelgrillo.ignition.isometric.common.comp.Custom2DTelemetryPanel;
import com.miguelgrillo.ignition.isometric.common.comp.Custom2DValve;
import com.miguelgrillo.ignition.isometric.common.comp.IsometricGenset;
import com.miguelgrillo.ignition.isometric.common.comp.IsometricPump;
import com.miguelgrillo.ignition.isometric.common.comp.IsometricTank;
import com.miguelgrillo.ignition.isometric.common.comp.IsometricTestSvg;
import com.miguelgrillo.ignition.isometric.common.comp.IsometricValve;

public class IsometricGatewayHook extends AbstractGatewayModuleHook {

    private static final LoggerEx log = LoggerEx.newBuilder().build("isometric.gateway.IsometricGatewayHook");

    private GatewayContext gatewayContext;
    private ComponentRegistry componentRegistry;

    @Override
    public void setup(GatewayContext context) {
        this.gatewayContext = context;
        log.info("Setting up Isometric Perspective Components module.");
    }

    @Override
    public void startup(LicenseState activationState) {
        log.info("Starting IsometricGatewayHook.");

        PerspectiveContext perspectiveContext = PerspectiveContext.get(this.gatewayContext);
        this.componentRegistry = perspectiveContext.getComponentRegistry();

        if (this.componentRegistry == null) {
            log.error("Perspective component registry not found. Isometric components will not be available.");
            return;
        }

        this.componentRegistry.registerComponent(IsometricPump.DESCRIPTOR);
        this.componentRegistry.registerComponent(IsometricValve.DESCRIPTOR);
        this.componentRegistry.registerComponent(IsometricTank.DESCRIPTOR);
        this.componentRegistry.registerComponent(IsometricGenset.DESCRIPTOR);
        this.componentRegistry.registerComponent(IsometricTestSvg.DESCRIPTOR);
        this.componentRegistry.registerComponent(Custom2DBusbarHEnergized.DESCRIPTOR);
        this.componentRegistry.registerComponent(Custom2DBusbarVEnergized.DESCRIPTOR);
        this.componentRegistry.registerComponent(Custom2DBusbarSegment.DESCRIPTOR);
        this.componentRegistry.registerComponent(Custom2DBusbarSegmentVertical.DESCRIPTOR);
        this.componentRegistry.registerComponent(Custom2DBusbarHTeeDown.DESCRIPTOR);
        this.componentRegistry.registerComponent(Custom2DBusbarHTeeRight.DESCRIPTOR);
        this.componentRegistry.registerComponent(Custom2DBusbarHTeeUp.DESCRIPTOR);
        this.componentRegistry.registerComponent(Custom2DBusbarHTeeLeft.DESCRIPTOR);
        this.componentRegistry.registerComponent(Custom2DBusbarHIntersection.DESCRIPTOR);
        this.componentRegistry.registerComponent(Custom2DBusbarSVTeeDown.DESCRIPTOR);
        this.componentRegistry.registerComponent(Custom2DBusbarSVTeeRight.DESCRIPTOR);
        this.componentRegistry.registerComponent(Custom2DBusbarSVTeeUp.DESCRIPTOR);
        this.componentRegistry.registerComponent(Custom2DBusbarSVTeeLeft.DESCRIPTOR);
        this.componentRegistry.registerComponent(Custom2DBusbarSVIntersection.DESCRIPTOR);
        this.componentRegistry.registerComponent(Custom2DBreakerClosed.DESCRIPTOR);
        this.componentRegistry.registerComponent(Custom2DBreakerOpen.DESCRIPTOR);
        this.componentRegistry.registerComponent(Custom2DCircuitBreakerModern.DESCRIPTOR);
        this.componentRegistry.registerComponent(Custom2DControlValveModern.DESCRIPTOR);
        this.componentRegistry.registerComponent(Custom2DGensetClosed.DESCRIPTOR);
        this.componentRegistry.registerComponent(Custom2DGensetOpen.DESCRIPTOR);
        this.componentRegistry.registerComponent(Custom2DGensetSync.DESCRIPTOR);
        this.componentRegistry.registerComponent(Custom2DTelemetryPanel.DESCRIPTOR);
        this.componentRegistry.registerComponent(Custom2DLvBreakerScreenFullPage.DESCRIPTOR);
        this.componentRegistry.registerComponent(Custom2DMvGensetScreenMain.DESCRIPTOR);
        this.componentRegistry.registerComponent(Custom2DModernGensetPanelV7FullPanel.DESCRIPTOR);
        this.componentRegistry.registerComponent(Custom2DValve.DESCRIPTOR);
        log.info("Registered isometric Perspective components.");
    }

    @Override
    public void shutdown() {
        log.info("Shutting down IsometricGatewayHook.");
        if (this.componentRegistry != null) {
            this.componentRegistry.removeComponent(IsometricPump.COMPONENT_ID);
            this.componentRegistry.removeComponent(IsometricValve.COMPONENT_ID);
            this.componentRegistry.removeComponent(IsometricTank.COMPONENT_ID);
            this.componentRegistry.removeComponent(IsometricGenset.COMPONENT_ID);
            this.componentRegistry.removeComponent(IsometricTestSvg.COMPONENT_ID);
            this.componentRegistry.removeComponent(Custom2DBusbarHEnergized.COMPONENT_ID);
            this.componentRegistry.removeComponent(Custom2DBusbarVEnergized.COMPONENT_ID);
            this.componentRegistry.removeComponent(Custom2DBusbarSegment.COMPONENT_ID);
            this.componentRegistry.removeComponent(Custom2DBusbarSegmentVertical.COMPONENT_ID);
            this.componentRegistry.removeComponent(Custom2DBusbarHTeeDown.COMPONENT_ID);
            this.componentRegistry.removeComponent(Custom2DBusbarHTeeRight.COMPONENT_ID);
            this.componentRegistry.removeComponent(Custom2DBusbarHTeeUp.COMPONENT_ID);
            this.componentRegistry.removeComponent(Custom2DBusbarHTeeLeft.COMPONENT_ID);
            this.componentRegistry.removeComponent(Custom2DBusbarHIntersection.COMPONENT_ID);
            this.componentRegistry.removeComponent(Custom2DBusbarSVTeeDown.COMPONENT_ID);
            this.componentRegistry.removeComponent(Custom2DBusbarSVTeeRight.COMPONENT_ID);
            this.componentRegistry.removeComponent(Custom2DBusbarSVTeeUp.COMPONENT_ID);
            this.componentRegistry.removeComponent(Custom2DBusbarSVTeeLeft.COMPONENT_ID);
            this.componentRegistry.removeComponent(Custom2DBusbarSVIntersection.COMPONENT_ID);
            this.componentRegistry.removeComponent(Custom2DBreakerClosed.COMPONENT_ID);
            this.componentRegistry.removeComponent(Custom2DBreakerOpen.COMPONENT_ID);
            this.componentRegistry.removeComponent(Custom2DCircuitBreakerModern.COMPONENT_ID);
            this.componentRegistry.removeComponent(Custom2DControlValveModern.COMPONENT_ID);
            this.componentRegistry.removeComponent(Custom2DGensetClosed.COMPONENT_ID);
            this.componentRegistry.removeComponent(Custom2DGensetOpen.COMPONENT_ID);
            this.componentRegistry.removeComponent(Custom2DGensetSync.COMPONENT_ID);
            this.componentRegistry.removeComponent(Custom2DTelemetryPanel.COMPONENT_ID);
            this.componentRegistry.removeComponent(Custom2DLvBreakerScreenFullPage.COMPONENT_ID);
            this.componentRegistry.removeComponent(Custom2DMvGensetScreenMain.COMPONENT_ID);
            this.componentRegistry.removeComponent(Custom2DModernGensetPanelV7FullPanel.COMPONENT_ID);
            this.componentRegistry.removeComponent(Custom2DValve.COMPONENT_ID);
        }
    }

    @Override
    public Optional<String> getMountedResourceFolder() {
        return Optional.of("mounted");
    }

    @Override
    public Optional<String> getMountPathAlias() {
        return Optional.of(IsometricComponents.URL_ALIAS);
    }

    @Override
    public boolean isFreeModule() {
        return true;
    }
}
