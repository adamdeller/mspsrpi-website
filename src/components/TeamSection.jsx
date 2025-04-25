import React from 'react';

const teamMembers = [
  {
    name: 'Nur Sarikaya',
    role: 'UI/UX Designer',
    image: '/images/nur.jpg',
    bio: 'Led the UI design and layout breakdown.',
  },
  {
    name: 'Allen Huang',
    role: 'Testing & Documentation',
    image: '/images/allen.jpg',
    bio: 'Responsible for test planning and documentation.',
  },
  {
    name: 'Kavindu',
    role: 'Frontend Developer',
    image: '/images/kavindu.jpg',
    bio: 'Built key components and handled React integration.',
  },
  {
    name: 'Xiang Li',
    role: 'Data Integration',
    image: '/images/xiang.jpg',
    bio: 'Managed data preprocessing and flow pipeline.',
  },
  {
    name: 'Nisha Jose',
    role: 'Publication & Metadata',
    image: '/images/nisha.jpg',
    bio: 'Handled pulsar metadata and related publications.',
  },
];

const TeamSection = () => {
  return (
    <section className="py-16 bg-gray-100">
      <div className="max-w-7xl mx-auto px-4 text-center">
        <h2 className="text-3xl font-bold mb-8">Meet the Team</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {teamMembers.map((member) => (
            <div
              key={member.name}
              className="bg-white p-6 rounded-2xl shadow hover:shadow-md transition duration-300"
            >
              <img
                src={member.image}
                alt={member.name}
                className="w-full h-48 object-cover rounded-xl mb-4"
              />
              <h3 className="text-xl font-semibold">{member.name}</h3>
              <p className="text-sm text-gray-500">{member.role}</p>
              <p className="mt-2 text-sm text-gray-700">{member.bio}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TeamSection;