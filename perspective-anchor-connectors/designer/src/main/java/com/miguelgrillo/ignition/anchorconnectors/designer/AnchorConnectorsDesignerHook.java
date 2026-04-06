package com.miguelgrillo.ignition.anchorconnectors.designer;

import com.inductiveautomation.ignition.common.licensing.LicenseState;
import com.inductiveautomation.ignition.common.util.LoggerEx;
import com.inductiveautomation.ignition.designer.model.AbstractDesignerModuleHook;
import com.inductiveautomation.ignition.designer.model.DesignerContext;
import com.inductiveautomation.perspective.designer.DesignerComponentRegistry;
import com.inductiveautomation.perspective.designer.api.ComponentDesignDelegateRegistry;
import com.inductiveautomation.perspective.designer.api.PerspectiveDesignerInterface;
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

public class AnchorConnectorsDesignerHook extends AbstractDesignerModuleHook {

    private static final LoggerEx log = LoggerEx.newBuilder().build("anchorconnectors.designer.AnchorConnectorsDesignerHook");

    private DesignerComponentRegistry registry;
    private ComponentDesignDelegateRegistry delegateRegistry;

    @Override
    public void startup(DesignerContext context, LicenseState activationState) {
        PerspectiveDesignerInterface pdi = PerspectiveDesignerInterface.get(context);
        this.registry = pdi.getDesignerComponentRegistry();
        this.delegateRegistry = pdi.getComponentDesignDelegateRegistry();

        this.registry.registerComponent(AnchorConnectorCanvas.DESCRIPTOR);
        this.registry.registerComponent(AnchorBreaker.DESCRIPTOR);
        this.registry.registerComponent(ConnectorOverlay.DESCRIPTOR);
        this.registry.registerComponent(ConnectorLine.DESCRIPTOR);
        this.registry.registerComponent(GensetPanel.DESCRIPTOR);
        this.registry.registerComponent(GensetPanelTransparent.DESCRIPTOR);
        this.registry.registerComponent(GensetPanelR2.DESCRIPTOR);
        this.registry.registerComponent(GensetPanelR2Transparent.DESCRIPTOR);
        this.registry.registerComponent(ModernLine.DESCRIPTOR);
        this.registry.registerComponent(ModernLineRev2.DESCRIPTOR);
        this.registry.registerComponent(ModernTank.DESCRIPTOR);
        this.registry.registerComponent(ModernTankRev2.DESCRIPTOR);
        this.registry.registerComponent(ModernValveControl.DESCRIPTOR);
        this.registry.registerComponent(ModernValveControlRev2.DESCRIPTOR);
        log.infof(
            "Registered anchor connector components '%s', '%s', '%s', '%s', '%s', '%s', '%s', '%s', '%s', '%s', '%s', '%s', '%s', '%s' in Designer.",
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

        if (this.delegateRegistry != null) {
            this.delegateRegistry.register(AnchorConnectorCanvas.COMPONENT_ID, new AnchorCanvasDesignDelegate());
            this.delegateRegistry.register(
                AnchorBreaker.COMPONENT_ID,
                new AnchorCanvasDesignDelegate(
                    "Anchor Breaker",
                    "Set props.targetId to a unique value. Connector Overlay resolves this via data-anchor-target-id."
                )
            );
            this.delegateRegistry.register(
                ConnectorOverlay.COMPONENT_ID,
                new AnchorCanvasDesignDelegate(
                    "Connector Overlay",
                    "Define props.connections[] with fromTargetId/toTargetId and named anchor ids. Legacy top/right/bottom/left anchors still work."
                )
            );
            this.delegateRegistry.register(
                ConnectorLine.COMPONENT_ID,
                new AnchorCanvasDesignDelegate(
                    "Connector Line",
                    "Set props.targetId to publish this line as an anchor target, then use props.fromTargetId/fromAnchor and props.toTargetId/toAnchor with named anchors. The line also supports glowIntensity and anchorPoints[] along the routed path."
                )
            );
            this.delegateRegistry.register(
                GensetPanel.COMPONENT_ID,
                new AnchorCanvasDesignDelegate(
                    "Genset Panel",
                    "Bind the genset status value fields directly in props and use props.anchorPoints[] for named snap targets. showAnchorPoints enables visible anchor debugging."
                )
            );
            this.delegateRegistry.register(
                GensetPanelTransparent.COMPONENT_ID,
                new AnchorCanvasDesignDelegate(
                    "Genset Panel Transparent",
                    "Transparent genset variant with the same bindable status fields and named anchorPoints[] snap targets."
                )
            );
            this.delegateRegistry.register(
                GensetPanelR2.COMPONENT_ID,
                new AnchorCanvasDesignDelegate(
                    "Genset Panel R2",
                    "Rev 2 genset panel with enlarged title area, bindable status fields, glowIntensity, and named anchorPoints[] snap targets."
                )
            );
            this.delegateRegistry.register(
                GensetPanelR2Transparent.COMPONENT_ID,
                new AnchorCanvasDesignDelegate(
                    "Genset Panel R2 Transparent",
                    "Transparent Rev 2 genset panel with bindable status fields and named anchorPoints[] snap targets."
                )
            );
            this.delegateRegistry.register(
                ModernLine.COMPONENT_ID,
                new AnchorCanvasDesignDelegate(
                    "Modern Line",
                    "Use props.targetId and anchorPoints[] to expose named snap targets across the symbol. showAnchorPoints enables anchor debugging."
                )
            );
            this.delegateRegistry.register(
                ModernLineRev2.COMPONENT_ID,
                new AnchorCanvasDesignDelegate(
                    "Modern Line Rev2",
                    "Transparent modern line variant with the same named anchorPoints[] and glowIntensity contract."
                )
            );
            this.delegateRegistry.register(
                ModernTank.COMPONENT_ID,
                new AnchorCanvasDesignDelegate(
                    "Modern Tank",
                    "Tank symbol with named anchorPoints[], glowIntensity, and optional visible anchor debugging markers."
                )
            );
            this.delegateRegistry.register(
                ModernTankRev2.COMPONENT_ID,
                new AnchorCanvasDesignDelegate(
                    "Modern Tank Rev2",
                    "Transparent tank variant with the same named anchorPoints[] snapping behavior."
                )
            );
            this.delegateRegistry.register(
                ModernValveControl.COMPONENT_ID,
                new AnchorCanvasDesignDelegate(
                    "Modern Valve Control",
                    "Valve control symbol with named anchorPoints[], glowIntensity, and optional visible anchor debugging markers."
                )
            );
            this.delegateRegistry.register(
                ModernValveControlRev2.COMPONENT_ID,
                new AnchorCanvasDesignDelegate(
                    "Modern Valve Control Rev2",
                    "Transparent valve control variant with the same named anchorPoints[] snapping behavior."
                )
            );
        }
    }

    @Override
    public void shutdown() {
        if (this.registry != null) {
            this.registry.removeComponent(AnchorConnectorCanvas.COMPONENT_ID);
            this.registry.removeComponent(AnchorBreaker.COMPONENT_ID);
            this.registry.removeComponent(ConnectorOverlay.COMPONENT_ID);
            this.registry.removeComponent(ConnectorLine.COMPONENT_ID);
            this.registry.removeComponent(GensetPanel.COMPONENT_ID);
            this.registry.removeComponent(GensetPanelTransparent.COMPONENT_ID);
            this.registry.removeComponent(GensetPanelR2.COMPONENT_ID);
            this.registry.removeComponent(GensetPanelR2Transparent.COMPONENT_ID);
            this.registry.removeComponent(ModernLine.COMPONENT_ID);
            this.registry.removeComponent(ModernLineRev2.COMPONENT_ID);
            this.registry.removeComponent(ModernTank.COMPONENT_ID);
            this.registry.removeComponent(ModernTankRev2.COMPONENT_ID);
            this.registry.removeComponent(ModernValveControl.COMPONENT_ID);
            this.registry.removeComponent(ModernValveControlRev2.COMPONENT_ID);
        }
        if (this.delegateRegistry != null) {
            this.delegateRegistry.remove(AnchorConnectorCanvas.COMPONENT_ID);
            this.delegateRegistry.remove(AnchorBreaker.COMPONENT_ID);
            this.delegateRegistry.remove(ConnectorOverlay.COMPONENT_ID);
            this.delegateRegistry.remove(ConnectorLine.COMPONENT_ID);
            this.delegateRegistry.remove(GensetPanel.COMPONENT_ID);
            this.delegateRegistry.remove(GensetPanelTransparent.COMPONENT_ID);
            this.delegateRegistry.remove(GensetPanelR2.COMPONENT_ID);
            this.delegateRegistry.remove(GensetPanelR2Transparent.COMPONENT_ID);
            this.delegateRegistry.remove(ModernLine.COMPONENT_ID);
            this.delegateRegistry.remove(ModernLineRev2.COMPONENT_ID);
            this.delegateRegistry.remove(ModernTank.COMPONENT_ID);
            this.delegateRegistry.remove(ModernTankRev2.COMPONENT_ID);
            this.delegateRegistry.remove(ModernValveControl.COMPONENT_ID);
            this.delegateRegistry.remove(ModernValveControlRev2.COMPONENT_ID);
        }
    }
}
