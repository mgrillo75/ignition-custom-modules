package com.miguelgrillo.ignition.xyflowcanvas.designer;

import com.inductiveautomation.ignition.common.licensing.LicenseState;
import com.inductiveautomation.ignition.common.util.LoggerEx;
import com.inductiveautomation.ignition.designer.model.AbstractDesignerModuleHook;
import com.inductiveautomation.ignition.designer.model.DesignerContext;
import com.inductiveautomation.perspective.designer.DesignerComponentRegistry;
import com.inductiveautomation.perspective.designer.api.ComponentDesignDelegateRegistry;
import com.inductiveautomation.perspective.designer.api.PerspectiveDesignerInterface;
import com.miguelgrillo.ignition.xyflowcanvas.common.comp.XYFlowCanvas;

public class XYFlowCanvasDesignerHook extends AbstractDesignerModuleHook {

    private static final LoggerEx log = LoggerEx.newBuilder().build("xyflowcanvas.designer.XYFlowCanvasDesignerHook");

    private DesignerComponentRegistry registry;
    private ComponentDesignDelegateRegistry delegateRegistry;

    @Override
    public void startup(DesignerContext context, LicenseState activationState) {
        log.info("Starting XYFlowCanvasDesignerHook.");

        PerspectiveDesignerInterface pdi = PerspectiveDesignerInterface.get(context);
        this.registry = pdi.getDesignerComponentRegistry();
        this.delegateRegistry = pdi.getComponentDesignDelegateRegistry();
        if (this.registry == null) {
            log.error("Designer component registry not found. XY Flow Canvas will not be available in Designer.");
            return;
        }

        this.registry.registerComponent(XYFlowCanvas.DESCRIPTOR);
        if (this.delegateRegistry != null) {
            this.delegateRegistry.register(XYFlowCanvas.COMPONENT_ID, new XYFlowCanvasDesignDelegate());
        }
        log.infof("Registered XY Flow Canvas component '%s' in Designer.", XYFlowCanvas.COMPONENT_ID);
    }

    @Override
    public void shutdown() {
        if (this.delegateRegistry != null) {
            this.delegateRegistry.remove(XYFlowCanvas.COMPONENT_ID);
        }
        if (this.registry != null) {
            this.registry.removeComponent(XYFlowCanvas.COMPONENT_ID);
        }
    }
}
