import * as go from 'gojs';
import { Injectable } from '@angular/core';
import { FishboneLink, FishboneLayout } from './FishboneLayout';

const $ = go.GraphObject.make;

const statusColours: object = {
  merged: 'black',
  superseded: 'grey',
  approved: 'green',
  submitted: 'yellow',
  draft: 'blue'
};

@Injectable()
export class WorkPackageDiagramService {

  getFishboneLayout(): go.TreeLayout {
    return $(FishboneLayout, {
      layerSpacing: 80,
      nodeSpacing: 50,
      rowSpacing: 50
    });
  }

  getBranchingLayout(): go.TreeLayout {
    return $(go.TreeLayout, {
      layerSpacing: 100,
      nodeSpacing: 80,
      alignment: go.TreeLayout.AlignmentBusBranching
    });
  }

  getNormalLayout(): go.TreeLayout {
    return $(go.TreeLayout, {
      nodeSpacing: 40,
      layerSpacing: 50
    });
  }

  getModel(workPackages): go.GraphLinksModel {
    return $(go.GraphLinksModel, {
      nodeKeyProperty: 'id',
      isReadOnly: true,
      nodeDataArray: JSON.parse(JSON.stringify(workPackages)),
      linkDataArray: this.getLinksForPackages(workPackages)
    });
  }

  // Check if a node is in a branch containing only merged/superseded workpackages
  isInMergedSupersededBranch(workpackage): boolean {
    if (['superseded', 'merged'].includes(workpackage.data.status)) {
      // If node is merged/superseded then check whether all subsequent nodes are merged/superseded
      return workpackage.findNodesOutOf().all(
        function(successor): boolean {
          return this.isInMergedSupersededBranch(successor);
        }.bind(this)
      );
    } else {
      return false;
    }
  }

  getLinksForPackages(workPackages): Array<go.TreeLayout>[] {

    const links = [];

    workPackages.forEach(function(workPackage) {

      if (workPackage.id === '00000000-0000-0000-0000-000000000000') {
        return;
      }

      workPackage.baseline.forEach(function(baseline) {
        links.push({
          from: baseline.id,
          to: workPackage.id
        });
      });
    });

    return links;
  }


  getNodeTemplate(): go.Node {
    return $(go.Node, go.Panel.Auto,
      {
        locationSpot: go.Spot.Center 
      },
      new go.Binding('visible', '', function(node): boolean {
        return !this.isInMergedSupersededBranch(node);
      }.bind(this)).ofObject(),
      $(go.TextBlock,
        {
          textAlign: 'center',
          font: 'bold 16px calibri',
          maxSize: new go.Size(200, Infinity),
          margin: new go.Margin(2)
        },
        new go.Binding('stroke', '', function(data) {
          if (data.hasErrors) {
            return 'red';
          } else {
            return statusColours[data.status];
          }
        }),
        new go.Binding('text', 'name')
      )
    )
  }

  getLink(): go.Link {
    return $(go.Link,
      { routing: go.Link.Orthogonal, corner: 4 },
      $(go.Shape)
    )
  }

  getFishboneLink(): go.Link {
    return $(FishboneLink,
      $(go.Shape)
    );
  }

}