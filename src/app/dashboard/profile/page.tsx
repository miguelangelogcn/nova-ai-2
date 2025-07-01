import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { CheckCircle2, Edit, Lightbulb, ShieldAlert, Target, TrendingUp } from "lucide-react";

const swotData = {
    strengths: [
        "Excellent patient communication",
        "Proficient in IV insertion",
        "Strong teamwork skills"
    ],
    weaknesses: [
        "Documentation time management",
        "Delegation of tasks",
        "Advanced cardiac life support (ACLS) knowledge"
    ],
    opportunities: [
        "Leadership training programs",
        "New hospital wing opening",
        "Mentorship from senior nurses"
    ],
    threats: [
        "High nurse-to-patient ratios",
        "Frequent changes in charting software",
        "Risk of burnout"
    ]
}

const learningPath = [
    { title: "Time Management for Nurses", reason: "To improve documentation efficiency." },
    { title: "Effective Leadership and Delegation", reason: "To enhance task delegation skills." },
    { title: "ACLS Certification Prep", reason: "To strengthen knowledge in advanced cardiac life support." },
    { title: "Burnout Prevention Strategies", reason: "To mitigate the risk of burnout." },
]

export default function ProfilePage() {
    return (
        <div className="space-y-6">
            <Card>
                <CardHeader>
                    <div className="flex items-center gap-4">
                        <Avatar className="h-20 w-20">
                            <AvatarImage src="https://placehold.co/80x80.png" data-ai-hint="woman smiling" alt="Jane Doe" />
                            <AvatarFallback>JD</AvatarFallback>
                        </Avatar>
                        <div>
                            <h1 className="text-3xl font-bold font-headline">Jane Doe</h1>
                            <p className="text-muted-foreground">Registered Nurse</p>
                            <div className="flex gap-2 mt-2">
                                <Badge>Cardiology</Badge>
                                <Badge variant="secondary">Team Alpha</Badge>
                            </div>
                        </div>
                        <Button variant="outline" className="ml-auto"><Edit className="mr-2 h-4 w-4" /> Edit Profile</Button>
                    </div>
                </CardHeader>
            </Card>

            <div className="grid md:grid-cols-2 gap-6">
                <Card>
                    <CardHeader>
                        <CardTitle className="font-headline">SWOT Analysis</CardTitle>
                        <CardDescription>Your professional strengths, weaknesses, opportunities, and threats.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="p-4 rounded-lg bg-green-50 border border-green-200">
                            <h3 className="font-semibold flex items-center gap-2 mb-2"><Lightbulb className="text-green-600" /> Strengths</h3>
                            <ul className="list-disc list-inside text-sm text-green-900">
                                {swotData.strengths.map(s => <li key={s}>{s}</li>)}
                            </ul>
                        </div>
                        <div className="p-4 rounded-lg bg-yellow-50 border border-yellow-200">
                            <h3 className="font-semibold flex items-center gap-2 mb-2"><Target className="text-yellow-600" /> Weaknesses</h3>
                            <ul className="list-disc list-inside text-sm text-yellow-900">
                                {swotData.weaknesses.map(s => <li key={s}>{s}</li>)}
                            </ul>
                        </div>
                        <div className="p-4 rounded-lg bg-blue-50 border border-blue-200">
                            <h3 className="font-semibold flex items-center gap-2 mb-2"><TrendingUp className="text-blue-600" /> Opportunities</h3>
                            <ul className="list-disc list-inside text-sm text-blue-900">
                                {swotData.opportunities.map(s => <li key={s}>{s}</li>)}
                            </ul>
                        </div>
                        <div className="p-4 rounded-lg bg-red-50 border border-red-200">
                            <h3 className="font-semibold flex items-center gap-2 mb-2"><ShieldAlert className="text-red-600" /> Threats</h3>
                            <ul className="list-disc list-inside text-sm text-red-900">
                                {swotData.threats.map(s => <li key={s}>{s}</li>)}
                            </ul>
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader>
                        <CardTitle className="font-headline">Personalized Learning Path</CardTitle>
                        <CardDescription>Courses recommended by your AI mentor to accelerate your growth.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <ul className="space-y-4">
                            {learningPath.map((item, index) => (
                                <li key={index} className="flex items-start gap-4">
                                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary mt-1">
                                        <CheckCircle2 />
                                    </div>
                                    <div>
                                        <h4 className="font-semibold">{item.title}</h4>
                                        <p className="text-sm text-muted-foreground">{item.reason}</p>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
