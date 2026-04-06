package com.miguelgrillo.ignition.anchorconnectors.designer;

import java.awt.BorderLayout;
import javax.swing.JComponent;
import javax.swing.JLabel;
import javax.swing.JPanel;
import javax.swing.SwingConstants;
import com.inductiveautomation.perspective.designer.api.ComponentDesignDelegate;
import com.inductiveautomation.perspective.designer.workspace.ComponentSelection;

public class AnchorCanvasDesignDelegate implements ComponentDesignDelegate {

    private final String headlineText;
    private final String noteText;

    public AnchorCanvasDesignDelegate() {
        this(
            "Anchor Connector Canvas",
            "Edit symbols, anchors, and connectors in props.<br/>Connectors resolve endpoints to named anchor ids and render orthogonal elbows."
        );
    }

    public AnchorCanvasDesignDelegate(String headlineText, String noteText) {
        this.headlineText = headlineText;
        this.noteText = noteText;
    }

    @Override
    public JComponent createSelectionEditor(ComponentSelection selection) {
        JPanel panel = new JPanel(new BorderLayout(0, 8));
        JLabel headline = new JLabel(this.headlineText, SwingConstants.LEFT);
        JLabel note = new JLabel("<html>" + this.noteText + "</html>", SwingConstants.LEFT);
        panel.add(headline, BorderLayout.NORTH);
        panel.add(note, BorderLayout.CENTER);
        return panel;
    }
}
