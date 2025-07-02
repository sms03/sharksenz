import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar, Plus, Target, TrendingUp, Users, DollarSign, CheckCircle, Clock, AlertTriangle } from "lucide-react";

interface Milestone {
  id: string;
  title: string;
  description: string;
  targetDate: string;
  status: 'planned' | 'in-progress' | 'completed' | 'at-risk';
  category: 'product' | 'revenue' | 'team' | 'funding' | 'market';
  priority: 'low' | 'medium' | 'high' | 'critical';
  dependencies: string[];
  metrics: {
    target: string;
    current?: string;
  };
}

const sampleMilestones: Milestone[] = [
  {
    id: '1',
    title: 'MVP Launch',
    description: 'Complete and launch minimum viable product with core features',
    targetDate: '2025-08-15',
    status: 'in-progress',
    category: 'product',
    priority: 'critical',
    dependencies: [],
    metrics: {
      target: '100% core features',
      current: '75% complete'
    }
  },
  {
    id: '2',
    title: 'First 100 Paying Customers',
    description: 'Achieve initial customer traction and validate product-market fit',
    targetDate: '2025-10-01',
    status: 'planned',
    category: 'revenue',
    priority: 'high',
    dependencies: ['1'],
    metrics: {
      target: '100 customers',
      current: '23 customers'
    }
  },
  {
    id: '3',
    title: 'Series A Fundraising',
    description: 'Raise $2M Series A to scale operations and marketing',
    targetDate: '2025-12-01',
    status: 'planned',
    category: 'funding',
    priority: 'high',
    dependencies: ['2'],
    metrics: {
      target: '$2M raised',
      current: 'Deck prepared'
    }
  },
  {
    id: '4',
    title: 'Team Expansion',
    description: 'Hire 5 key team members: 2 engineers, 1 designer, 2 sales',
    targetDate: '2025-11-15',
    status: 'planned',
    category: 'team',
    priority: 'medium',
    dependencies: ['3'],
    metrics: {
      target: '5 new hires',
      current: '2 interviews scheduled'
    }
  }
];

const TimelinePlanner = () => {
  const [milestones, setMilestones] = useState<Milestone[]>(sampleMilestones);
  const [newMilestone, setNewMilestone] = useState<Partial<Milestone>>({
    category: 'product',
    priority: 'medium',
    status: 'planned'
  });
  const [showAddForm, setShowAddForm] = useState(false);

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'product': return <Target className="w-4 h-4" />;
      case 'revenue': return <DollarSign className="w-4 h-4" />;
      case 'team': return <Users className="w-4 h-4" />;
      case 'funding': return <TrendingUp className="w-4 h-4" />;
      case 'market': return <TrendingUp className="w-4 h-4" />;
      default: return <Target className="w-4 h-4" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800 border-green-200';
      case 'in-progress': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'at-risk': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical': return 'bg-red-500';
      case 'high': return 'bg-orange-500';
      case 'medium': return 'bg-yellow-500';
      case 'low': return 'bg-green-500';
      default: return 'bg-gray-500';
    }
  };

  const addMilestone = () => {
    if (!newMilestone.title || !newMilestone.targetDate) return;
    
    const milestone: Milestone = {
      id: Date.now().toString(),
      title: newMilestone.title,
      description: newMilestone.description || '',
      targetDate: newMilestone.targetDate,
      status: newMilestone.status as Milestone['status'] || 'planned',
      category: newMilestone.category as Milestone['category'] || 'product',
      priority: newMilestone.priority as Milestone['priority'] || 'medium',
      dependencies: [],
      metrics: {
        target: newMilestone.metrics?.target || 'To be defined'
      }
    };

    setMilestones([...milestones, milestone]);
    setNewMilestone({
      category: 'product',
      priority: 'medium',
      status: 'planned'
    });
    setShowAddForm(false);
  };

  const sortedMilestones = [...milestones].sort((a, b) => 
    new Date(a.targetDate).getTime() - new Date(b.targetDate).getTime()
  );

  return (
    <div className="space-y-6">
      {/* Timeline Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-2xl font-bold text-blue-600">
                {milestones.filter(m => m.status === 'completed').length}
              </div>
              <div className="text-sm text-blue-600">Completed</div>
            </div>
            <CheckCircle className="w-8 h-8 text-blue-500" />
          </div>
        </div>
        
        <div className="p-4 bg-yellow-50 rounded-lg border border-yellow-200">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-2xl font-bold text-yellow-600">
                {milestones.filter(m => m.status === 'in-progress').length}
              </div>
              <div className="text-sm text-yellow-600">In Progress</div>
            </div>
            <Clock className="w-8 h-8 text-yellow-500" />
          </div>
        </div>
        
        <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-2xl font-bold text-gray-600">
                {milestones.filter(m => m.status === 'planned').length}
              </div>
              <div className="text-sm text-gray-600">Planned</div>
            </div>
            <Target className="w-8 h-8 text-gray-500" />
          </div>
        </div>
        
        <div className="p-4 bg-red-50 rounded-lg border border-red-200">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-2xl font-bold text-red-600">
                {milestones.filter(m => m.status === 'at-risk').length}
              </div>
              <div className="text-sm text-red-600">At Risk</div>
            </div>
            <AlertTriangle className="w-8 h-8 text-red-500" />
          </div>
        </div>
      </div>

      {/* Add Milestone Button */}
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Milestone Timeline</h3>
        <Button onClick={() => setShowAddForm(!showAddForm)} size="sm">
          <Plus className="w-4 h-4 mr-2" />
          Add Milestone
        </Button>
      </div>

      {/* Add Milestone Form */}
      {showAddForm && (
        <Card>
          <CardHeader>
            <CardTitle>Add New Milestone</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  value={newMilestone.title || ''}
                  onChange={(e) => setNewMilestone({...newMilestone, title: e.target.value})}
                  placeholder="e.g., Launch Beta Version"
                />
              </div>
              <div>
                <Label htmlFor="targetDate">Target Date</Label>
                <Input
                  id="targetDate"
                  type="date"
                  value={newMilestone.targetDate || ''}
                  onChange={(e) => setNewMilestone({...newMilestone, targetDate: e.target.value})}
                />
              </div>
            </div>
            
            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={newMilestone.description || ''}
                onChange={(e) => setNewMilestone({...newMilestone, description: e.target.value})}
                placeholder="Detailed description of this milestone..."
                rows={3}
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label>Category</Label>
                <Select 
                  value={newMilestone.category} 
                  onValueChange={(value) => setNewMilestone({...newMilestone, category: value as Milestone['category']})}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="product">Product</SelectItem>
                    <SelectItem value="revenue">Revenue</SelectItem>
                    <SelectItem value="team">Team</SelectItem>
                    <SelectItem value="funding">Funding</SelectItem>
                    <SelectItem value="market">Market</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label>Priority</Label>
                <Select 
                  value={newMilestone.priority} 
                  onValueChange={(value) => setNewMilestone({...newMilestone, priority: value as Milestone['priority']})}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Low</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                    <SelectItem value="critical">Critical</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label htmlFor="target">Success Metric</Label>
                <Input
                  id="target"
                  value={newMilestone.metrics?.target || ''}
                  onChange={(e) => setNewMilestone({
                    ...newMilestone, 
                    metrics: { target: e.target.value }
                  })}
                  placeholder="e.g., 100 signups"
                />
              </div>
            </div>
            
            <div className="flex space-x-2">
              <Button onClick={addMilestone}>Add Milestone</Button>
              <Button variant="outline" onClick={() => setShowAddForm(false)}>Cancel</Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Timeline */}
      <div className="space-y-4">
        {sortedMilestones.map((milestone, index) => (
          <div key={milestone.id} className="relative">
            {/* Timeline Line */}
            {index < sortedMilestones.length - 1 && (
              <div className="absolute left-6 top-16 bottom-0 w-0.5 bg-gray-200"></div>
            )}
            
            <div className="flex items-start space-x-4">
              {/* Timeline Dot */}
              <div className={`w-12 h-12 rounded-full border-4 border-white shadow-lg flex items-center justify-center ${getStatusColor(milestone.status)}`}>
                {getCategoryIcon(milestone.category)}
              </div>
              
              {/* Milestone Card */}
              <Card className="flex-1">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <h4 className="font-semibold">{milestone.title}</h4>
                        <div className={`w-3 h-3 rounded-full ${getPriorityColor(milestone.priority)}`}></div>
                        <Badge className={getStatusColor(milestone.status)}>
                          {milestone.status.replace('-', ' ')}
                        </Badge>
                      </div>
                      
                      <p className="text-sm text-gray-600 mb-3">{milestone.description}</p>
                      
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                        <div>
                          <span className="font-medium">Target Date:</span>
                          <div className="text-gray-600">{new Date(milestone.targetDate).toLocaleDateString()}</div>
                        </div>
                        <div>
                          <span className="font-medium">Category:</span>
                          <div className="text-gray-600 capitalize">{milestone.category}</div>
                        </div>
                        <div>
                          <span className="font-medium">Success Metric:</span>
                          <div className="text-gray-600">{milestone.metrics.target}</div>
                          {milestone.metrics.current && (
                            <div className="text-blue-600 text-xs">Current: {milestone.metrics.current}</div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        ))}
      </div>

      {/* Insights */}
      <Card className="bg-blue-50 border-blue-200">
        <CardHeader>
          <CardTitle className="text-blue-800">Timeline Insights</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <h5 className="font-semibold mb-2">Critical Path Analysis</h5>
              <p className="text-gray-600">
                Your MVP launch is the critical dependency for customer acquisition. 
                Consider adding buffer time for technical challenges.
              </p>
            </div>
            <div>
              <h5 className="font-semibold mb-2">Risk Assessment</h5>
              <p className="text-gray-600">
                Fundraising timeline depends on customer traction. Have contingency 
                plans for extending runway if milestones slip.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TimelinePlanner;
