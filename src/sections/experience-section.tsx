import Section from "../components/section";

export default function ExperienceSection() {
    const experience = [
        {
            image: "/assets/google.svg",
            title: "Sr. Software engineer",
            company: "Google",
            location: "New York",
            start: "Jan 2024",
            end: "Present",
            description: [
                "Lead end-to-end development of large-scale, high-performance systems used by millions of users.",
                "Mentor junior engineers, conduct code reviews, and uphold engineering best practices.",
            ],
        },
        {
            image: "/assets/microsoft.svg",
            title: "Full Stack developer",
            company: "Microsoft",
            location: "London",
            start: "May 2021",
            end: "Dec 2024",
            description: [
                "Full-stack development of large-scale, high-performance systems used by millions of users.",
                "Mentor junior engineers, conduct code reviews, and uphold engineering best practices.",
            ],
        },
    ];

    return (
        <Section title="Experience">
            <div className="space-y-6">
                {experience.map((experience) => (
                    <div key={experience.title} className="w-full border border-gray-200 p-6 rounded-xl">
                        <div className="flex flex-col md:flex-row items-start gap-3 md:items-center justify-between w-full text-gray-500">
                            <div className="flex flex-col md:flex-row items-start md:items-center gap-3">
                                <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
                                    <img
                                        src={experience.image}
                                        alt={experience.title}
                                        width={25}
                                        height={25}
                                    />
                                </div>
                                <div>
                                    <h3 className="text-base font-medium text-gray-800">
                                        {experience.title}
                                    </h3>
                                    <div>{experience.company}</div>
                                </div>
                            </div>
                            <div>{experience.start} - {experience.end}</div>
                        </div>
                        <ul className="list-disc px-5 mt-6 text-gray-500 space-y-2">
                            {experience.description.map((description) => (
                                <li key={description}>{description}</li>
                            ))}
                        </ul>
                    </div>
                ))}
            </div>
        </Section>
    );
}