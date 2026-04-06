package com.miguelgrillo.ignition.xyflowcanvas.gateway;

import java.util.Optional;
import com.inductiveautomation.ignition.common.licensing.LicenseState;
import com.inductiveautomation.ignition.common.util.LoggerEx;
import com.inductiveautomation.ignition.gateway.model.AbstractGatewayModuleHook;
import com.inductiveautomation.ignition.gateway.model.GatewayContext;
import com.inductiveautomation.perspective.common.api.ComponentRegistry;
import com.inductiveautomation.perspective.gateway.api.PerspectiveContext;
import com.miguelgrillo.ignition.xyflowcanvas.common.XYFlowCanvasComponents;
import com.miguelgrillo.ignition.xyflowcanvas.common.comp.XYFlowCanvas;

public class XYFlowCanvasGatewayHook extends AbstractGatewayModuleHook {

    private static final LoggerEx log = LoggerEx.newBuilder().build("xyflowcanvas.gateway.XYFlowCanvasGatewayHook");

    private GatewayContext gatewayContext;
    private ComponentRegistry componentRegistry;

    @Override
    public void setup(GatewayContext context) {
        this.gatewayContext = context;
        log.info("Setting up Perspective XY Flow Canvas module.");
    }

    @Override
    public void startup(LicenseState activationState) {
        log.info("Starting XYFlowCanvasGatewayHook.");

        PerspectiveContext perspectiveContext = PerspectiveContext.get(this.gatewayContext);
        this.componentRegistry = perspectiveContext.getComponentRegistry();

        if (this.componentRegistry == null) {
            log.error("Perspective component registry not found. XY Flow Canvas will not be available.");
            return;
        }

        this.componentRegistry.registerComponent(XYFlowCanvas.DESCRIPTOR);
        log.infof("Registered XY Flow Canvas component '%s'.", XYFlowCanvas.COMPONENT_ID);
    }

    @Override
    public void shutdown() {
        log.info("Shutting down XYFlowCanvasGatewayHook.");
        if (this.componentRegistry != null) {
            this.componentRegistry.removeComponent(XYFlowCanvas.COMPONENT_ID);
        }
    }

    @Override
    public Optional<String> getMountedResourceFolder() {
        return Optional.of("mounted");
    }

    @Override
    public Optional<String> getMountPathAlias() {
        return Optional.of(XYFlowCanvasComponents.URL_ALIAS);
    }

    @Override
    public boolean isFreeModule() {
        return true;
    }
}
