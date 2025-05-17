/**
 * MobileTabsTest.tsx - Component for testing responsive tab behavior
 */
import { useState, useEffect } from "react";
import MainLayout from "@/layouts/MainLayout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { updateTabShadows } from "@/utils/responsive-tabs";
import { Button } from "@/components/ui/button";

// Test tab categories
const testTabs = [
  { id: "tab1", name: "First Tab", content: "Content for first tab" },
  { id: "tab2", name: "Second Tab", content: "Content for second tab" },
  { id: "tab3", name: "Third Tab", content: "Content for third tab" },
  { id: "tab4", name: "Fourth Tab", content: "Content for fourth tab" },
  { id: "tab5", name: "Fifth Tab", content: "Content for fifth tab" },
  { id: "tab6", name: "Sixth Tab", content: "Content for sixth tab" },
  { id: "tab7", name: "Seventh Tab", content: "Content for seventh tab" },
];

export default function MobileTabsTest() {
  const [currentTab, setCurrentTab] = useState("tab1");
  const [testToggle, setTestToggle] = useState(false);
  
  // Initialize responsive tabs
  useEffect(() => {
    const handleResize = () => {
      updateTabShadows();
    };
    
    // Initial update
    setTimeout(() => {
      updateTabShadows();
    }, 100);
    
    // Update on resize
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  
  return (
    <MainLayout>
      <div className="mx-auto max-w-6xl">
        <div className="mb-8">
          <h1 className="font-heading mb-2 text-3xl font-bold">Responsive Tabs Test</h1>
          <p className="font-subheading-libre text-lg text-muted-foreground">
            Testing mobile tab responsiveness
          </p>
        </div>
        
        <Button onClick={() => setTestToggle(!testToggle)} className="mb-4">
          {testToggle ? "Show Fewer Tabs" : "Show More Tabs"}
        </Button>
        
        <h2 className="text-xl font-semibold mb-4">Dashboard Style Tabs</h2>
        <Tabs 
          value={currentTab}
          onValueChange={(value) => {
            setCurrentTab(value);
            // Scroll the selected tab into view on mobile
            setTimeout(() => {
              const selectedTab = document.querySelector(`[data-state="active"][role="tab"]`);
              if (selectedTab && window.innerWidth < 768) {
                selectedTab.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
              }
            }, 10);
          }}
          className="w-full mb-8"
        >
          <div className="scrollable-tabs-container">
            <TabsList className="scrollable-tabs-list w-full md-grid-tabs md:grid-cols-6">
              {testTabs.slice(0, testToggle ? 7 : 5).map((tab) => (
                <TabsTrigger key={tab.id} value={tab.id} className="tab-trigger-mobile whitespace-nowrap">
                  {tab.name}
                </TabsTrigger>
              ))}
            </TabsList>
          </div>
          
          {testTabs.map((tab) => (
            <TabsContent key={tab.id} value={tab.id} className="mt-6 border p-4 rounded-lg">
              <h3 className="text-lg font-medium mb-2">{tab.name}</h3>
              <p>{tab.content}</p>
            </TabsContent>
          ))}
        </Tabs>
        
        <h2 className="text-xl font-semibold mb-4">Learning Style Tabs</h2>
        <Tabs 
          defaultValue="tab1" 
          className="mb-8"
          onValueChange={(value) => {
            // Scroll the selected tab into view on mobile
            setTimeout(() => {
              const selectedTab = document.querySelector(`[data-state="active"][role="tab"]:not(:first-child)`);
              if (selectedTab && window.innerWidth < 768) {
                selectedTab.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
              }
            }, 10);
          }}
        >
          <div className="scrollable-tabs-container">
            <TabsList className="scrollable-tabs-list w-full md-grid-tabs md:grid-cols-4">
              {testTabs.slice(0, testToggle ? 7 : 4).map((tab) => (
                <TabsTrigger key={tab.id} value={tab.id} className="tab-trigger-mobile">
                  {tab.name}
                </TabsTrigger>
              ))}
            </TabsList>
          </div>
          
          {testTabs.map((tab) => (
            <TabsContent key={tab.id} value={tab.id} className="mt-6 border p-4 rounded-lg">
              <h3 className="text-lg font-medium mb-2">{tab.name}</h3>
              <p>{tab.content}</p>
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </MainLayout>
  );
}
