import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import Image from "next/image";
import Link from "next/link";

const courses = [
  { id: '1', title: 'Advanced Cardiac Life Support (ACLS)', description: 'Master the skills needed to manage cardiac arrest and other cardiovascular emergencies.', progress: 75, category: 'Certifications', image: 'https://placehold.co/600x400.png', dataAiHint: 'medical training' },
  { id: '2', title: 'Pediatric Advanced Life Support (PALS)', description: 'Learn to recognize and manage life-threatening conditions in infants and children.', progress: 30, category: 'Certifications', image: 'https://placehold.co/600x400.png', dataAiHint: 'children healthcare' },
  { id: '3', title: 'Effective Communication in Healthcare', description: 'Enhance your communication skills with patients, families, and colleagues.', progress: 100, category: 'Soft Skills', image: 'https://placehold.co/600x400.png', dataAiHint: 'doctor patient' },
  { id: '4', title: 'Wound Care and Management', description: 'A comprehensive guide to assessing and treating different types of wounds.', progress: 0, category: 'Clinical Skills', image: 'https://placehold.co/600x400.png', dataAiHint: 'nurse patient' },
  { id: '5', title: 'Time Management for Nurses', description: 'Strategies to prioritize tasks, manage time effectively, and reduce stress.', progress: 0, category: 'Soft Skills', image: 'https://placehold.co/600x400.png', dataAiHint: 'nurse writing' },
  { id: '6', title: 'Pharmacology Fundamentals', description: 'An essential review of medication administration, side effects, and interactions.', progress: 50, category: 'Clinical Skills', image: 'https://placehold.co/600x400.png', dataAiHint: 'pills medication' },
];

export default function CoursesPage() {
    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold font-headline">Course Library</h1>
                <p className="text-muted-foreground">Expand your knowledge and skills with our comprehensive list of courses.</p>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {courses.map(course => (
                    <Link href={`/dashboard/courses/${course.id}`} key={course.id}>
                        <Card className="flex flex-col h-full hover:shadow-lg transition-shadow duration-300">
                            <CardHeader className="p-0">
                                <div className="relative h-48 w-full">
                                    <Image
                                        src={course.image}
                                        alt={course.title}
                                        layout="fill"
                                        objectFit="cover"
                                        className="rounded-t-lg"
                                        data-ai-hint={course.dataAiHint}
                                    />
                                </div>
                            </CardHeader>
                            <CardContent className="flex-grow p-4 space-y-2">
                                <Badge variant="secondary">{course.category}</Badge>
                                <CardTitle className="font-headline text-lg">{course.title}</CardTitle>
                                <CardDescription className="text-sm">{course.description}</CardDescription>
                            </CardContent>
                            <CardFooter className="p-4">
                                {course.progress > 0 ? (
                                    <div className="w-full">
                                        <div className="flex justify-between items-center mb-1">
                                            <span className="text-xs text-muted-foreground">Progress</span>
                                            <span className="text-xs font-semibold">{course.progress}%</span>
                                        </div>
                                        <Progress value={course.progress} />
                                    </div>
                                ) : (
                                    <p className="text-xs text-muted-foreground">Not started</p>
                                )}
                            </CardFooter>
                        </Card>
                    </Link>
                ))}
            </div>
        </div>
    )
}
