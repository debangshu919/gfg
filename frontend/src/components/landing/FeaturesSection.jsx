import React from 'react';
import { BarChart, Database, Terminal, Zap, Shield, LineChart } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../ui/card';
import { motion } from 'framer-motion';

export default function FeaturesSection() {
  const features = [
    {
      title: "Instant Chart Generation",
      description: "Visualize trends and patterns instantly. Ask for a bar chart of sales by region, or a line graph of user signups over time.",
      icon: <BarChart className="w-8 h-8 text-blue-500" />,
      colSpan: "md:col-span-2",
      bgClass: "bg-blue-50 dark:bg-blue-950/20"
    },
    {
      title: "Natural Language to SQL",
      description: "No need to write complex JOINs. Simply ask questions in plain English and let PromptBI generate and execute the perfect SQL query.",
      icon: <Terminal className="w-8 h-8 text-indigo-500" />,
      colSpan: "md:col-span-1",
      bgClass: "bg-indigo-50 dark:bg-indigo-950/20"
    },
    {
      title: "Seamless DB Integration",
      description: "Connect safely to your PostgreSQL, MySQL, or cloud databases with a few clicks. Your credentials are fully encrypted.",
      icon: <Database className="w-8 h-8 text-green-500" />,
      colSpan: "md:col-span-1",
      bgClass: "bg-green-50 dark:bg-green-950/20"
    },
    {
      title: "Self-Serve Analytics",
      description: "Empower non-technical teams to answer their own questions without waiting days for the data engineering team.",
      icon: <Zap className="w-8 h-8 text-amber-500" />,
      colSpan: "md:col-span-2",
      bgClass: "bg-amber-50 dark:bg-amber-950/20"
    }
  ];

  return (
    <section className="py-24 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold mb-4">Powerful Analytics, Simplified</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Built for everyone. Whether you are deeply technical or completely code-averse, PromptBI adapts to your needs.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
              className={feature.colSpan}
            >
              <Card className={`h-full border-0 shadow-md flex flex-col justify-between ${feature.bgClass}`}>
                <CardHeader>
                  <div className="mb-4 bg-background w-16 h-16 rounded-xl flex items-center justify-center shadow-sm">
                    {feature.icon}
                  </div>
                  <CardTitle className="text-2xl">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base text-muted-foreground leading-relaxed">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
