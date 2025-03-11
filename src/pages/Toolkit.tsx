
import { TokenomicsQuestionnaire } from "@/components/forms/tokenomics/TokenomicsQuestionnaire";
import { ValuationSection } from "@/components/forms/tokenomics/ValuationSection";
import { NavBar } from "@/components/layout/NavBar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const Toolkit = () => {
  return (
    <>
      <NavBar />
      <div className="min-h-screen bg-gradient-to-br from-zinc-50 via-zinc-100 to-zinc-200 dark:from-zinc-900 dark:via-zinc-800 dark:to-zinc-900">
        <div className="container mx-auto px-4 py-16 md:py-24">
          <div className="text-center space-y-6 mb-16">
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight bg-gradient-to-r from-purple-500 to-blue-500 bg-clip-text text-transparent">
              Web3 Launch Toolkit
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto">
              Configure your token launch parameters and get personalized recommendations
            </p>
          </div>
          
          <div className="max-w-4xl mx-auto">
            <Tabs defaultValue="questionnaire" className="space-y-6">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="questionnaire">Launch Questionnaire</TabsTrigger>
                <TabsTrigger value="valuation">Token Valuation</TabsTrigger>
              </TabsList>
              <TabsContent value="questionnaire">
                <TokenomicsQuestionnaire />
              </TabsContent>
              <TabsContent value="valuation">
                <ValuationSection />
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </>
  );
};

export default Toolkit;
