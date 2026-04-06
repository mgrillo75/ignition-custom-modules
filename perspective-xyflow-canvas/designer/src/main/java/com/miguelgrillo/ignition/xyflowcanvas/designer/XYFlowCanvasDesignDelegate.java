package com.miguelgrillo.ignition.xyflowcanvas.designer;

import java.awt.BorderLayout;
import javax.swing.BorderFactory;
import javax.swing.JComponent;
import javax.swing.JLabel;
import javax.swing.JPanel;
import com.inductiveautomation.perspective.designer.api.ComponentDesignDelegate;
import com.inductiveautomation.perspective.designer.api.DesignerComponentStoreBridge;

public class XYFlowCanvasDesignDelegate implements ComponentDesignDelegate {

    @Override
    public JComponent createDeepSelectionEditor(DesignerComponentStoreBridge bridge) {
        return createInstructionPanel("Deep-selected XY Flow Canvas. Use the canvas surface to edit internals.");
    }

    private JComponent createInstructionPanel(String message) {
        JPanel panel = new JPanel(new BorderLayout());
        panel.setBorder(BorderFactory.createEmptyBorder(8, 8, 8, 8));
        panel.add(new JLabel(message), BorderLayout.CENTER);
        return panel;
    }
}
