package com.miguelgrillo.ignition.anchorconnectors.gateway;

import java.util.Optional;
import com.inductiveautomation.ignition.common.licensing.LicenseState;
import com.inductiveautomation.ignition.common.util.LoggerEx;
import com.inductiveautomation.ignition.gateway.model.AbstractGatewayModuleHook;
import com.inductiveautomation.ignition.gateway.model.GatewayContext;
import com.inductiveautomation.perspective.common.api.ComponentRegistry;
import com.inductiveautomation.perspective.gateway.api.PerspectiveContext;
import com.miguelgrillo.ignition.anchorconnectors.common.AnchorConnectorComponents;
import com.miguelgrillo.ignition.anchorconnectors.common.comp.AnchorBreaker;
import com.miguelgrillo.ignition.anchorconnectors.common.comp.AnchorConnectorCanvas;
import com.miguelgrillo.ignition.anchorconnectors.common.comp.ConnectorOverlay;
import com.miguelgrillo.ignition.anchorconnectors.common.comp.ConnectorLine;
import com.miguelgrillo.ignition.anchorconnectors.common.comp.GensetPanel;
import com.miguelgrillo.ignition.anchorconnectors.common.comp.GensetPanelR2;
import com.miguelgrillo.ignition.anchorconnectors.common.comp.GensetPanelR2Transparent;
import com.miguelgrillo.ignition.anchorconnectors.common.comp.GensetPanelTransparent;
import com.miguelgrillo.ignition.anchorconnectors.common.comp.ModernLine;
import com.miguelgrillo.ignition.anchorconnectors.common.comp.ModernLineRev2;
import com.miguelgrillo.ignition.anchorconnectors.common.comp.ModernTank;
import com.miguelgrillo.ignition.anchorconnectors.common.comp.ModernTankRev2;
import com.miguelgrillo.ignition.anchorconnectors.common.comp.ModernValveControl;
import com.miguelgrillo.ignition.anchorconnectors.common.comp.ModernValveControlRev2;

public class AnchorConnectorsGatewayHook extends AbstractGatewayModuleHook {

    private static final LoggerEx log = LoggerEx.newBuilder().build("anchorconnectors.gateway.AnchorConnectorsGatewayHook");

    private GatewayContext gatewayContext;
    private ComponentRegistry componentRegistry;

    @Override
    public void setup(GatewayContext context) {
        this.gatewayContext = context;
        log.info("Setting up Perspective Anchor Connectors module.");
    }

    @Override
    public void startup(LicenseState activationState) {
        log.info("Starting AnchorConnectorsGatewayHook.");

        PerspectiveContext perspectiveContext = PerspectiveContext.get(this.gatewayContext);
        this.componentRegistry = perspectiveContext.getComponentRegistry();

        if (this.componentRegistry == null) {
            log.error("Perspective component registry not found. Anchor connector components will not be available.");
            return;
        }

        this.componentRegistry.registerComponent(AnchorConnectorCanvas.DESCRIPTOR);
        this.componentRegistry.registerComponent(AnchorBreaker.DESCRIPTOR);
        this.componentRegistry.registerComponent(ConnectorOverlay.DESCRIPTOR);
        this.componentRegistry.registerComponent(ConnectorLine.DESCRIPTOR);
        this.componentRegistry.registerComponent(GensetPanel.DESCRIPTOR);
        this.componentRegistry.registerComponent(GensetPanelTransparent.DESCRIPTOR);
        this.componentRegistry.registerComponent(GensetPanelR2.DESCRIPTOR);
        this.componentRegistry.registerComponent(GensetPanelR2Transparent.DESCRIPTOR);
        this.componentRegistry.registerComponent(ModernLine.DESCRIPTOR);
        this.componentRegistry.registerComponent(ModernLineRev2.DESCRIPTOR);
        this.componentRegistry.registerComponent(ModernTank.DESCRIPTOR);
        this.componentRegistry.registerComponent(ModernTankRev2.DESCRIPTOR);
        this.componentRegistry.registerComponent(ModernValveControl.DESCRIPTOR);
        this.componentRegistry.registerComponent(ModernValveControlRev2.DESCRIPTOR);
        log.infof(
            "Registered anchor connector components '%s', '%s', '%s', '%s', '%s', '%s', '%s', '%s', '%s', '%s', '%s', '%s', '%s', '%s'.",
            AnchorConnectorCanvas.COMPONENT_ID,
            AnchorBreaker.COMPONENT_ID,
            ConnectorOverlay.COMPONENT_ID,
            ConnectorLine.COMPONENT_ID,
            GensetPanel.COMPONENT_ID,
            GensetPanelTransparent.COMPONENT_ID,
            GensetPanelR2.COMPONENT_ID,
            GensetPanelR2Transparent.COMPONENT_ID,
            ModernLine.COMPONENT_ID,
            ModernLineRev2.COMPONENT_ID,
            ModernTank.COMPONENT_ID,
            ModernTankRev2.COMPONENT_ID,
            ModernValveControl.COMPONENT_ID,
            ModernValveControlRev2.COMPONENT_ID
        );
    }

    @Override
    public void shutdown() {
        log.info("Shutting down AnchorConnectorsGatewayHook.");
        if (this.componentRegistry != null) {
            this.componentRegistry.removeComponent(AnchorConnectorCanvas.COMPONENT_ID);
            this.componentRegistry.removeComponent(AnchorBreaker.COMPONENT_ID);
            this.componentRegistry.removeComponent(ConnectorOverlay.COMPONENT_ID);
            this.componentRegistry.removeComponent(ConnectorLine.COMPONENT_ID);
            this.componentRegistry.removeComponent(GensetPanel.COMPONENT_ID);
            this.componentRegistry.removeComponent(GensetPanelTransparent.COMPONENT_ID);
            this.componentRegistry.removeComponent(GensetPanelR2.COMPONENT_ID);
            this.componentRegistry.removeComponent(GensetPanelR2Transparent.COMPONENT_ID);
            this.componentRegistry.removeComponent(ModernLine.COMPONENT_ID);
            this.componentRegistry.removeComponent(ModernLineRev2.COMPONENT_ID);
            this.componentRegistry.removeComponent(ModernTank.COMPONENT_ID);
            this.componentRegistry.removeComponent(ModernTankRev2.COMPONENT_ID);
            this.componentRegistry.removeComponent(ModernValveControl.COMPONENT_ID);
            this.componentRegistry.removeComponent(ModernValveControlRev2.COMPONENT_ID);
        }
    }

    @Override
    public Optional<String> getMountedResourceFolder() {
        return Optional.of("mounted");
    }

    @Override
    public Optional<String> getMountPathAlias() {
        return Optional.of(AnchorConnectorComponents.URL_ALIAS);
    }

    @Override
    public boolean isFreeModule() {
        return true;
    }
}
