package com.miguelgrillo.ignition.isometric.designer;

import com.inductiveautomation.ignition.common.licensing.LicenseState;
import com.inductiveautomation.ignition.common.util.LoggerEx;
import com.inductiveautomation.ignition.designer.model.AbstractDesignerModuleHook;
import com.inductiveautomation.ignition.designer.model.DesignerContext;
import com.inductiveautomation.perspective.designer.DesignerComponentRegistry;
import com.inductiveautomation.perspective.designer.api.PerspectiveDesignerInterface;
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

public class IsometricDesignerHook extends AbstractDesignerModuleHook {

    private static final LoggerEx logger = LoggerEx.newBuilder().build("isometric.designer.IsometricDesignerHook");

    private DesignerContext context;
    private DesignerComponentRegistry registry;

    @Override
    public void startup(DesignerContext context, LicenseState activationState) {
        this.context = context;
        PerspectiveDesignerInterface pdi = PerspectiveDesignerInterface.get(this.context);
        this.registry = pdi.getDesignerComponentRegistry();

        this.registry.registerComponent(IsometricPump.DESCRIPTOR);
        this.registry.registerComponent(IsometricValve.DESCRIPTOR);
        this.registry.registerComponent(IsometricTank.DESCRIPTOR);
        this.registry.registerComponent(IsometricGenset.DESCRIPTOR);
        this.registry.registerComponent(IsometricTestSvg.DESCRIPTOR);
        this.registry.registerComponent(Custom2DBusbarHEnergized.DESCRIPTOR);
        this.registry.registerComponent(Custom2DBusbarVEnergized.DESCRIPTOR);
        this.registry.registerComponent(Custom2DBusbarSegment.DESCRIPTOR);
        this.registry.registerComponent(Custom2DBusbarSegmentVertical.DESCRIPTOR);
        this.registry.registerComponent(Custom2DBusbarHTeeDown.DESCRIPTOR);
        this.registry.registerComponent(Custom2DBusbarHTeeRight.DESCRIPTOR);
        this.registry.registerComponent(Custom2DBusbarHTeeUp.DESCRIPTOR);
        this.registry.registerComponent(Custom2DBusbarHTeeLeft.DESCRIPTOR);
        this.registry.registerComponent(Custom2DBusbarHIntersection.DESCRIPTOR);
        this.registry.registerComponent(Custom2DBusbarSVTeeDown.DESCRIPTOR);
        this.registry.registerComponent(Custom2DBusbarSVTeeRight.DESCRIPTOR);
        this.registry.registerComponent(Custom2DBusbarSVTeeUp.DESCRIPTOR);
        this.registry.registerComponent(Custom2DBusbarSVTeeLeft.DESCRIPTOR);
        this.registry.registerComponent(Custom2DBusbarSVIntersection.DESCRIPTOR);
        this.registry.registerComponent(Custom2DBreakerClosed.DESCRIPTOR);
        this.registry.registerComponent(Custom2DBreakerOpen.DESCRIPTOR);
        this.registry.registerComponent(Custom2DCircuitBreakerModern.DESCRIPTOR);
        this.registry.registerComponent(Custom2DControlValveModern.DESCRIPTOR);
        this.registry.registerComponent(Custom2DGensetClosed.DESCRIPTOR);
        this.registry.registerComponent(Custom2DGensetOpen.DESCRIPTOR);
        this.registry.registerComponent(Custom2DGensetSync.DESCRIPTOR);
        this.registry.registerComponent(Custom2DTelemetryPanel.DESCRIPTOR);
        this.registry.registerComponent(Custom2DLvBreakerScreenFullPage.DESCRIPTOR);
        this.registry.registerComponent(Custom2DMvGensetScreenMain.DESCRIPTOR);
        this.registry.registerComponent(Custom2DModernGensetPanelV7FullPanel.DESCRIPTOR);
        this.registry.registerComponent(Custom2DValve.DESCRIPTOR);
        logger.info("Registered isometric Perspective components in Designer.");
    }

    @Override
    public void shutdown() {
        if (this.registry != null) {
            this.registry.removeComponent(IsometricPump.COMPONENT_ID);
            this.registry.removeComponent(IsometricValve.COMPONENT_ID);
            this.registry.removeComponent(IsometricTank.COMPONENT_ID);
            this.registry.removeComponent(IsometricGenset.COMPONENT_ID);
            this.registry.removeComponent(IsometricTestSvg.COMPONENT_ID);
            this.registry.removeComponent(Custom2DBusbarHEnergized.COMPONENT_ID);
            this.registry.removeComponent(Custom2DBusbarVEnergized.COMPONENT_ID);
            this.registry.removeComponent(Custom2DBusbarSegment.COMPONENT_ID);
            this.registry.removeComponent(Custom2DBusbarSegmentVertical.COMPONENT_ID);
            this.registry.removeComponent(Custom2DBusbarHTeeDown.COMPONENT_ID);
            this.registry.removeComponent(Custom2DBusbarHTeeRight.COMPONENT_ID);
            this.registry.removeComponent(Custom2DBusbarHTeeUp.COMPONENT_ID);
            this.registry.removeComponent(Custom2DBusbarHTeeLeft.COMPONENT_ID);
            this.registry.removeComponent(Custom2DBusbarHIntersection.COMPONENT_ID);
            this.registry.removeComponent(Custom2DBusbarSVTeeDown.COMPONENT_ID);
            this.registry.removeComponent(Custom2DBusbarSVTeeRight.COMPONENT_ID);
            this.registry.removeComponent(Custom2DBusbarSVTeeUp.COMPONENT_ID);
            this.registry.removeComponent(Custom2DBusbarSVTeeLeft.COMPONENT_ID);
            this.registry.removeComponent(Custom2DBusbarSVIntersection.COMPONENT_ID);
            this.registry.removeComponent(Custom2DBreakerClosed.COMPONENT_ID);
            this.registry.removeComponent(Custom2DBreakerOpen.COMPONENT_ID);
            this.registry.removeComponent(Custom2DCircuitBreakerModern.COMPONENT_ID);
            this.registry.removeComponent(Custom2DControlValveModern.COMPONENT_ID);
            this.registry.removeComponent(Custom2DGensetClosed.COMPONENT_ID);
            this.registry.removeComponent(Custom2DGensetOpen.COMPONENT_ID);
            this.registry.removeComponent(Custom2DGensetSync.COMPONENT_ID);
            this.registry.removeComponent(Custom2DTelemetryPanel.COMPONENT_ID);
            this.registry.removeComponent(Custom2DLvBreakerScreenFullPage.COMPONENT_ID);
            this.registry.removeComponent(Custom2DMvGensetScreenMain.COMPONENT_ID);
            this.registry.removeComponent(Custom2DModernGensetPanelV7FullPanel.COMPONENT_ID);
            this.registry.removeComponent(Custom2DValve.COMPONENT_ID);
        }
    }
}
