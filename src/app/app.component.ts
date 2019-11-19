import { Component, ElementRef, ViewChild, OnInit } from '@angular/core';
import * as go from 'gojs';
import { WorkPackageDiagramService } from './workpackage-diagram.service';
import { workpackages } from './workpackage-data';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  providers: [WorkPackageDiagramService]
})
export class AppComponent implements OnInit {

  public diagram: go.Diagram;

  @ViewChild('diagramDiv', {static: true}) private diagramRef: ElementRef;

  constructor(private workPackageDiagramService: WorkPackageDiagramService) {
    this.diagram = new go.Diagram();
  }

  ngOnInit(): void {
    this.diagram.div = this.diagramRef.nativeElement;
    this.diagram.nodeTemplate = this.workPackageDiagramService.getNodeTemplate();
    this.diagram.model = this.workPackageDiagramService.getModel(workpackages);
    this.layoutFishbone();
  }

  layoutFishbone(): void {
    this.diagram.startTransaction("fishbone layout");
    this.diagram.linkTemplate = this.workPackageDiagramService.getFishboneLink();
    this.diagram.layout = this.workPackageDiagramService.getFishboneLayout()
    this.diagram.commitTransaction("fishbone layout");
  }

  layoutBranching(): void {
    this.diagram.startTransaction("branching layout");
    this.diagram.linkTemplate = this.workPackageDiagramService.getLink();
    this.diagram.layout = this.workPackageDiagramService.getBranchingLayout();
    this.diagram.commitTransaction("branching layout");
  }

  layoutNormal(): void {
    this.diagram.startTransaction("normal layout");
    this.diagram.linkTemplate = this.workPackageDiagramService.getLink();
    this.diagram.layout = this.workPackageDiagramService.getNormalLayout();
    this.diagram.commitTransaction("normal layout");
  }

}