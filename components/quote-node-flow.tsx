'use client';

import React, { useMemo } from 'react';
import {
  ReactFlow,
  MiniMap,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  Node,
  Edge,
  Handle,
  Position,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { ProposalData, LineItem } from '@/lib/types';

// Custom node component for products
const ProductNode = ({ data }: any) => {
  return (
    <div className="bg-white border-2 border-[var(--color-pencil)] p-4 w-[220px] shadow-[4px_4px_0_0_#2d2d2d] transition-transform duration-200 hover:-translate-y-1 rotate-1" style={{ borderRadius: '255px 15px 225px 15px / 15px 225px 15px 255px' }}>
      <Handle type="target" position={Position.Top} className="w-2 h-2 opacity-0" />
      <div className="font-heading font-bold text-xl text-[var(--color-pencil)] mb-1 leading-tight">{data.description || 'Unnamed Product'}</div>
      <div className="text-sm font-bold opacity-80">Qty: {data.quantity}</div>
      <div className="text-lg text-[var(--color-pen-blue)] font-bold mt-2">
        {data.currencySymbol}{data.rate.toFixed(2)} / ea
      </div>
      <Handle type="source" position={Position.Bottom} className="w-2 h-2 opacity-0" />
    </div>
  );
};

// Custom node component for functions
const FunctionNode = ({ data }: any) => {
  return (
    <div className={`bg-[var(--color-postit)] p-4 w-[220px] border-2 border-[var(--color-pencil)] shadow-[4px_4px_0_0_#2d2d2d] transition-transform duration-200 hover:-translate-y-1 -rotate-1 relative`}>
      <div className="deco-tack"></div>
      <Handle type="target" position={Position.Top} className="w-2 h-2 opacity-0" />
      <div className="font-heading font-bold text-xl text-[var(--color-pencil)] mb-1 leading-tight mt-2">{data.description || 'Function'}</div>
      <div className="text-lg text-[var(--color-marker-red)] font-bold mt-2">
        {data.currencySymbol}{(data.rate * data.quantity).toFixed(2)}
      </div>
      {data.isNegotiable ? (
        <div className="inline-block mt-3 text-sm font-bold px-2 border-2 border-dashed border-[var(--color-pencil)] rotate-2">Negotiable</div>
      ) : (
        <div className="inline-block mt-3 text-sm font-bold px-2 border-2 border-dashed border-[var(--color-pencil)] opacity-50 -rotate-2">Fixed</div>
      )}
      <Handle type="source" position={Position.Bottom} className="w-2 h-2 opacity-0" />
    </div>
  );
};

const nodeTypes = {
  productNode: ProductNode,
  functionNode: FunctionNode,
};

interface QuoteNodeFlowProps {
  proposal: ProposalData;
}

export function QuoteNodeFlow({ proposal }: QuoteNodeFlowProps) {
  const getSymbol = (curr: string) => {
    const symbols: Record<string, string> = {
      USD: '$', EUR: '€', GBP: '£', CAD: '$', AUD: '$', 
      JPY: '¥', INR: '₹', CNY: '¥', CHF: 'CHF', SGD: '$', NZD: '$', ZAR: 'R'
    };
    return symbols[curr] || '$';
  };
  const currencySymbol = getSymbol(proposal.currency);

  const { initialNodes, initialEdges } = useMemo(() => {
    const nodes: Node[] = [];
    const edges: Edge[] = [];
    
    const levelMap = new Map<number, LineItem[]>();
    proposal.lineItems.forEach(item => {
      const lvl = item.level || 1;
      if (!levelMap.has(lvl)) levelMap.set(lvl, []);
      levelMap.get(lvl)!.push(item);
    });

    // Sort levels numerically
    const sortedLevels = Array.from(levelMap.keys()).sort((a, b) => a - b);
    
    let previousLevelNodes: string[] = [];
    
    sortedLevels.forEach((lvl, levelIndex) => {
      const items = levelMap.get(lvl)!;
      const yOffset = 50 + (levelIndex * 150);
      
      // Center items horizontally based on how many are in the level
      const nodeWidth = 220;
      const startX = 250 - ((items.length - 1) * nodeWidth) / 2;
      
      const currentLevelNodeIds: string[] = [];
      
      items.forEach((item, index) => {
        const nodeId = `item-${item.id}`;
        currentLevelNodeIds.push(nodeId);
        
        nodes.push({
          id: nodeId,
          type: item.type === 'function' ? 'functionNode' : 'productNode',
          position: { x: startX + (index * nodeWidth), y: yOffset },
          data: { ...item, currencySymbol },
        });
        
        if (levelIndex > 0 && previousLevelNodes.length > 0) {
          // Connect previous level to current level
          previousLevelNodes.forEach(prevId => {
            edges.push({
              id: `e-${prevId}-${nodeId}`,
              source: prevId,
              target: nodeId,
              animated: item.type === 'function',
              style: { stroke: item.type === 'function' ? '#fdba74' : '#93c5fd', opacity: 0.5 }
            });
          });
        }
      });
      
      previousLevelNodes = currentLevelNodeIds;
    });

    return { initialNodes: nodes, initialEdges: edges };
  }, [proposal, currencySymbol]);

  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  // Update nodes if proposal changes
  React.useEffect(() => {
    setNodes(initialNodes);
    setEdges(initialEdges);
  }, [initialNodes, initialEdges, setNodes, setEdges]);

  return (
    <div style={{ width: '100%', height: '500px' }} className="border rounded-lg bg-transparent overflow-hidden">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        nodeTypes={nodeTypes}
        fitView
      >
        <Controls />
        <MiniMap />
        <Background gap={12} size={1} />
      </ReactFlow>
    </div>
  );
}
