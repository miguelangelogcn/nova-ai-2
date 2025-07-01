import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { CheckCircle, Download, FileText, MessageCircle } from "lucide-react";

export default function CourseDetailPage({ params }: { params: { id: string } }) {
    return (
        <div className="grid lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
                <Card>
                    <CardHeader>
                        <Badge variant="secondary" className="w-fit">Certifications</Badge>
                        <CardTitle className="text-3xl font-headline mt-2">Advanced Cardiac Life Support (ACLS)</CardTitle>
                        <CardDescription>Master the skills needed to manage cardiac arrest and other cardiovascular emergencies.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="aspect-video bg-muted rounded-lg mb-4 flex items-center justify-center">
                           <p className="text-muted-foreground">Video player placeholder</p>
                        </div>
                        <Separator className="my-6" />
                        <h3 className="text-xl font-bold font-headline mb-2">About this course</h3>
                        <p className="text-muted-foreground">
                            The ACLS Provider Course is designed for healthcare professionals who either direct or participate in the management of cardiopulmonary arrest or other cardiovascular emergencies. This includes personnel in emergency response, emergency medicine, intensive care, and critical care units.
                            <br/><br/>
                            Through instruction and active participation in case-based scenarios, learners will enhance their skills in the diagnosis and treatment of cardiopulmonary arrest, acute arrhythmia, stroke, and acute coronary syndromes.
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle className="font-headline flex items-center gap-2"><MessageCircle /> Comments</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            <div className="flex gap-3">
                                <Textarea placeholder="Add your comment..." />
                                <Button>Post</Button>
                            </div>
                            <Separator />
                            <div className="flex items-start gap-3">
                                <Avatar>
                                    <AvatarImage src="https://placehold.co/40x40.png" data-ai-hint="man smiling" />
                                    <AvatarFallback>TM</AvatarFallback>
                                </Avatar>
                                <div>
                                    <p className="font-semibold">Tom Marvolo</p>
                                    <p className="text-sm text-muted-foreground">This was a great refresher on the latest guidelines. The case scenarios were very helpful!</p>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
            <div className="space-y-6">
                 <Card>
                    <CardHeader>
                        <CardTitle className="font-headline">Course Content</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <ul className="space-y-2 text-sm">
                            <li className="flex items-center gap-2 font-semibold text-primary"><CheckCircle /> Introduction to ACLS</li>
                            <li className="flex items-center gap-2 font-semibold text-primary"><CheckCircle /> Basic Life Support Review</li>
                            <li className="flex items-center gap-2">Airway Management</li>
                            <li className="flex items-center gap-2 text-muted-foreground">Arrhythmia Recognition</li>
                            <li className="flex items-center gap-2 text-muted-foreground">Acute Coronary Syndromes</li>
                            <li className="flex items-center gap-2 text-muted-foreground">Stroke Management</li>
                        </ul>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader>
                        <CardTitle className="font-headline">Resources</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <ul className="space-y-2">
                           <li className="flex items-center justify-between">
                                <div className="flex items-center gap-2 text-sm">
                                    <FileText />
                                    <span>ACLS Algorithms PDF</span>
                                </div>
                                <Button variant="ghost" size="icon"><Download /></Button>
                           </li>
                           <li className="flex items-center justify-between">
                                <div className="flex items-center gap-2 text-sm">
                                    <FileText />
                                    <span>Medication Guide</span>
                                </div>
                                <Button variant="ghost" size="icon"><Download /></Button>
                           </li>
                        </ul>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
