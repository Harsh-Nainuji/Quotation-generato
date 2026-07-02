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
    <div className="glass-panel p-4 w-[220px] shadow-sm transition-all duration-300 hover:shadow-md hover:-translate-y-1">
      <Handle type="target" position={Position.Top} className="w-2 h-2 opacity-0" />
      <div className="font-semibold text-sm text-[var(--color-text-primary)] mb-1">{data.description || 'Unnamed Product'}</div>
      <div className="text-xs text-[var(--color-text-secondary)] font-medium">Qty: {data.quantity}</div>
      <div className="text-sm text-[var(--color-accent-highlight)] font-bold mt-2">
        {data.currencySymbol}{data.rate.toFixed(2)} / ea
      </div>
      <Handle type="source" position={Position.Bottom} className="w-2 h-2 opacity-0" />
    </div>
  );
};

// Custom node component for functions
const FunctionNode = ({ data }: any) => {
  return (
    <div className={`glass-primary p-4 w-[220px] rounded-[24px] text-center shadow-sm transition-all duration-300 hover:shadow-md hover:-translate-y-1 border-t-[3px] ${data.isNegotiable ? 'border-t-[var(--color-accent-glacier)]' : 'border-t-[var(--color-accent-moonstone)]'}`}>
      <Handle type="target" position={Position.Top} className="w-2 h-2 opacity-0" />
      <div className="font-semibold text-sm text-[var(--color-text-primary)] mb-1">{data.description || 'Function'}</div>
      <div className="text-sm text-[var(--color-text-primary)] font-bold mt-2">
        {data.currencySymbol}{(data.rate * data.quantity).toFixed(2)}
      </div>
      {data.isNegotiable ? (
        <div className="glass-badge mt-3 text-[var(--color-accent-highlight)] bg-white/40">Negotiable</div>
      ) : (
        <div className="glass-badge mt-3 text-[var(--color-text-muted)] bg-white/40">Fixed</div>
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
