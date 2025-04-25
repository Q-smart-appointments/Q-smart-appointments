
// This file would normally contain API calls to your backend service
// For this demo, we're using mock data and local storage

import { v4 as uuidv4 } from 'uuid';

// Types
export interface Service {
  id: string;
  name: string;
  description: string;
  icon: string;
  providers: Provider[];
}

export interface Provider {
  id: string;
  name: string;
  specialization: string;
  image?: string;
  averageWaitTime: number; // in minutes
}

export interface TimeSlot {
  id: string;
  providerId: string;
  date: string; // ISO format
  startTime: string; // HH:MM format
  endTime: string; // HH:MM format
  isAvailable: boolean;
}

export interface Appointment {
  id: string;
  serviceId: string;
  serviceName: string;
  providerId: string;
  providerName: string;
  customerId: string;
  customerName: string;
  date: string;
  startTime: string;
  endTime: string;
  status: 'scheduled' | 'in-progress' | 'completed' | 'cancelled' | 'no-show';
  queuePosition?: number;
  estimatedWaitTime?: number; // in minutes
}

export interface QueueInfo {
  position: number;
  estimatedWaitTime: number;
  appointmentsAhead: number;
  status: 'waiting' | 'in-progress' | 'ready' | 'completed';
}

// Mock data
const services: Service[] = [
  {
    id: "s1",
    name: "Medical Consultation",
    description: "General check-up and consultation with a doctor",
    icon: "🩺",
    providers: [
      { 
        id: "p1", 
        name: "Dr. Jane Smith", 
        specialization: "General Medicine", 
        averageWaitTime: 15 
      },
      { 
        id: "p2", 
        name: "Dr. Michael Chen", 
        specialization: "Family Medicine", 
        averageWaitTime: 20 
      },
    ]
  },
  {
    id: "s2",
    name: "Dental Care",
    description: "Dental checkup, cleaning, and consultation",
    icon: "🦷",
    providers: [
      { 
        id: "p3", 
        name: "Dr. Sarah Johnson", 
        specialization: "General Dentistry", 
        averageWaitTime: 25 
      }
    ]
  },
  {
    id: "s3",
    name: "Hair Salon",
    description: "Haircuts, styling, and treatments",
    icon: "✂️",
    providers: [
      { 
        id: "p4", 
        name: "Alex Rodriguez", 
        specialization: "Hair Stylist", 
        averageWaitTime: 30 
      },
      { 
        id: "p5", 
        name: "Jamie Lee", 
        specialization: "Color Specialist", 
        averageWaitTime: 45 
      }
    ]
  },
  {
    id: "s4",
    name: "Banking Services",
    description: "Account services and financial consultation",
    icon: "🏦",
    providers: [
      { 
        id: "p6", 
        name: "Taylor Morgan", 
        specialization: "Personal Banking", 
        averageWaitTime: 10 
      }
    ]
  }
];

// Mock API functions
export function getServices(): Promise<Service[]> {
  return Promise.resolve(services);
}

export function getServiceById(id: string): Promise<Service | undefined> {
  const service = services.find(s => s.id === id);
  return Promise.resolve(service);
}

export function getProviders(): Promise<Provider[]> {
  const allProviders = services.flatMap(s => s.providers);
  return Promise.resolve(allProviders);
}

export function getProvidersByService(serviceId: string): Promise<Provider[]> {
  const service = services.find(s => s.id === serviceId);
  return Promise.resolve(service?.providers || []);
}

// Generate available time slots for the next 7 days
export function getAvailableTimeSlots(providerId: string): Promise<TimeSlot[]> {
  const timeSlots: TimeSlot[] = [];
  const today = new Date();
  
  // Generate slots for the next 7 days
  for (let i = 0; i < 7; i++) {
    const date = new Date(today);
    date.setDate(today.getDate() + i);
    const dateString = date.toISOString().split('T')[0];
    
    // Generate slots from 9 AM to 5 PM with 30-minute intervals
    for (let hour = 9; hour < 17; hour++) {
      for (let minute = 0; minute < 60; minute += 30) {
        // Randomly make some slots unavailable
        const isAvailable = Math.random() > 0.3;
        
        // Format times as HH:MM
        const startHour = hour.toString().padStart(2, '0');
        const startMinute = minute.toString().padStart(2, '0');
        const startTime = `${startHour}:${startMinute}`;
        
        const endHour = minute === 30 ? (hour + 1).toString().padStart(2, '0') : startHour;
        const endMinute = minute === 30 ? '00' : '30';
        const endTime = `${endHour}:${endMinute}`;
        
        timeSlots.push({
          id: uuidv4(),
          providerId,
          date: dateString,
          startTime,
          endTime,
          isAvailable
        });
      }
    }
  }
  
  return Promise.resolve(timeSlots);
}

// Get appointments from local storage or initialize if not present
function getSavedAppointments(): Appointment[] {
  const saved = localStorage.getItem('appointments');
  return saved ? JSON.parse(saved) : [];
}

// Save appointments to local storage
function saveAppointments(appointments: Appointment[]): void {
  localStorage.setItem('appointments', JSON.stringify(appointments));
}

export function createAppointment(appointment: Omit<Appointment, 'id' | 'status' | 'queuePosition' | 'estimatedWaitTime'>): Promise<Appointment> {
  const appointments = getSavedAppointments();
  
  // Find service and provider to get names
  const service = services.find(s => s.id === appointment.serviceId);
  const provider = service?.providers.find(p => p.id === appointment.providerId);
  
  const newAppointment: Appointment = {
    ...appointment,
    id: uuidv4(),
    serviceName: service?.name || '',
    providerName: provider?.name || '',
    status: 'scheduled',
    queuePosition: appointments.filter(a => 
      a.providerId === appointment.providerId && 
      a.date === appointment.date && 
      a.status !== 'cancelled' && 
      a.status !== 'no-show' &&
      a.status !== 'completed'
    ).length + 1,
    estimatedWaitTime: provider?.averageWaitTime || 15
  };
  
  appointments.push(newAppointment);
  saveAppointments(appointments);
  
  return Promise.resolve(newAppointment);
}

export function getAppointmentsByCustomer(customerId: string): Promise<Appointment[]> {
  const appointments = getSavedAppointments();
  const customerAppointments = appointments.filter(a => a.customerId === customerId);
  return Promise.resolve(customerAppointments);
}

export function getAppointmentsByProvider(providerId: string): Promise<Appointment[]> {
  const appointments = getSavedAppointments();
  const providerAppointments = appointments.filter(a => a.providerId === providerId);
  return Promise.resolve(providerAppointments);
}

export function updateAppointmentStatus(id: string, status: Appointment['status']): Promise<Appointment> {
  const appointments = getSavedAppointments();
  const index = appointments.findIndex(a => a.id === id);
  
  if (index === -1) {
    return Promise.reject(new Error('Appointment not found'));
  }
  
  appointments[index] = {
    ...appointments[index],
    status
  };
  
  // Update queue positions and wait times for other appointments
  if (status === 'completed' || status === 'no-show' || status === 'cancelled') {
    const { providerId, date } = appointments[index];
    const relatedAppointments = appointments.filter(a => 
      a.providerId === providerId && 
      a.date === date && 
      a.id !== id &&
      a.status !== 'completed' && 
      a.status !== 'no-show' && 
      a.status !== 'cancelled'
    );
    
    // Update positions
    relatedAppointments.forEach(appointment => {
      const currentIndex = appointments.findIndex(a => a.id === appointment.id);
      if (currentIndex !== -1 && appointment.queuePosition && appointment.queuePosition > (appointments[index].queuePosition || 0)) {
        appointments[currentIndex].queuePosition = (appointment.queuePosition - 1);
        
        // Update estimated wait time (simplified)
        if (appointments[currentIndex].estimatedWaitTime && appointments[currentIndex].estimatedWaitTime > 15) {
          appointments[currentIndex].estimatedWaitTime -= 15;
        }
      }
    });
  }
  
  saveAppointments(appointments);
  return Promise.resolve(appointments[index]);
}

export function getAppointmentById(id: string): Promise<Appointment | undefined> {
  const appointments = getSavedAppointments();
  const appointment = appointments.find(a => a.id === id);
  return Promise.resolve(appointment);
}

export function getQueueInfo(appointmentId: string): Promise<QueueInfo> {
  const appointments = getSavedAppointments();
  const appointment = appointments.find(a => a.id === appointmentId);
  
  if (!appointment) {
    return Promise.reject(new Error('Appointment not found'));
  }
  
  const { providerId, date, queuePosition, status } = appointment;
  
  // Count appointments ahead in the queue
  const appointmentsAhead = appointments.filter(a => 
    a.providerId === providerId && 
    a.date === date && 
    a.status !== 'completed' && 
    a.status !== 'no-show' && 
    a.status !== 'cancelled' &&
    ((a.queuePosition || 0) < (queuePosition || 0))
  ).length;
  
  // Find provider to get average wait time
  let averageWaitTime = 15; // default
  for (const service of services) {
    const provider = service.providers.find(p => p.id === providerId);
    if (provider) {
      averageWaitTime = provider.averageWaitTime;
      break;
    }
  }
  
  // Calculate estimated wait time based on appointments ahead and average time
  const estimatedWaitTime = appointmentsAhead * averageWaitTime;
  
  // Determine queue status
  let queueStatus: QueueInfo['status'] = 'waiting';
  if (status === 'completed') {
    queueStatus = 'completed';
  } else if (status === 'in-progress') {
    queueStatus = 'in-progress';
  } else if (appointmentsAhead === 0 && status === 'scheduled') {
    queueStatus = 'ready';
  }
  
  return Promise.resolve({
    position: queuePosition || 0,
    estimatedWaitTime,
    appointmentsAhead,
    status: queueStatus
  });
}

export function getProviderStats(providerId: string): Promise<{
  totalAppointments: number;
  completedAppointments: number;
  noShows: number;
  averageWaitTime: number;
}> {
  const appointments = getSavedAppointments();
  const providerAppointments = appointments.filter(a => a.providerId === providerId);
  
  const totalAppointments = providerAppointments.length;
  const completedAppointments = providerAppointments.filter(a => a.status === 'completed').length;
  const noShows = providerAppointments.filter(a => a.status === 'no-show').length;
  
  // Mock average wait time calculation
  const averageWaitTime = 18; // In minutes
  
  return Promise.resolve({
    totalAppointments,
    completedAppointments,
    noShows,
    averageWaitTime
  });
}
