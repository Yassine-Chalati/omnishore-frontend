import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MainContainer } from "../../containers/main-container/main-container";

@Component({
  selector: 'app-matching-page',
  imports: [MainContainer, CommonModule],
  templateUrl: './matching-page.html',
  styleUrl: './matching-page.css'
})
export class MatchingPage implements OnInit, OnDestroy {
  jobDescriptionData: any = null;
  dataAvailable: boolean = false;

  constructor(
    public router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    console.log('MatchingPage ngOnInit - getting job description data...');
    
    // Get the ID from the route
    const routeId = Number(this.route.snapshot.paramMap.get('id'));
    console.log('Route ID:', routeId);
    
    // First try to get from router state (navigation)
    const navigation = this.router.getCurrentNavigation();
    if (navigation?.extras?.state?.['jobDescriptionData']) {
      this.jobDescriptionData = navigation.extras.state['jobDescriptionData'];
      console.log('MatchingPage received job description data from router state:', this.jobDescriptionData);
      
      // Verify the ID matches
      if (this.jobDescriptionData.id === routeId) {
        // Store in localStorage for persistence
        const dataToStore = {
          jobDescriptionData: this.jobDescriptionData,
          jobDescriptionId: this.jobDescriptionData.id,
          timestamp: Date.now()
        };
        localStorage.setItem('currentJobDescriptionData', JSON.stringify(dataToStore));
        this.dataAvailable = true;
      } else {
        console.log('ID mismatch between route and data, redirecting...');
        this.handleNoData();
        return;
      }
    } else {
      // Fallback: Get from localStorage (page refresh scenario)
      console.log('No router state, trying localStorage...');
      const storedData = localStorage.getItem('currentJobDescriptionData');
      if (storedData) {
        try {
          const parsedData = JSON.parse(storedData);
          
          // Check if the stored data has the expected structure
          if (parsedData.jobDescriptionData && parsedData.jobDescriptionId) {
            // Verify the ID matches the route
            if (parsedData.jobDescriptionId === routeId) {
              this.jobDescriptionData = parsedData.jobDescriptionData;
              console.log('MatchingPage received job description data from localStorage with matching ID:', this.jobDescriptionData);
              this.dataAvailable = true;
            } else {
              console.log('ID mismatch: route ID', routeId, 'vs stored ID', parsedData.jobDescriptionId);
              this.handleNoData();
              return;
            }
          } else {
            // Handle old format (backward compatibility)
            if (parsedData.id === routeId) {
              this.jobDescriptionData = parsedData;
              console.log('MatchingPage received job description data from localStorage (old format):', this.jobDescriptionData);
              this.dataAvailable = true;
            } else {
              console.log('ID mismatch in old format data');
              this.handleNoData();
              return;
            }
          }
        } catch (error) {
          console.error('Error parsing localStorage data:', error);
          this.handleNoData();
          return;
        }
      } else {
        console.log('No jobDescriptionData found in localStorage');
        this.handleNoData();
        return;
      }
    }
  }

  private handleNoData() {
    console.log('No job description data available, redirecting to job descriptions page');
    this.dataAvailable = false;
    // Redirect back to job descriptions page if no data is available
    this.router.navigate(['/admin/job-description']);
  }

  ngOnDestroy() {
    // Optional: Clear localStorage when leaving the page if you want to ensure fresh data
    // Uncomment the line below if you want to clear data on page leave
    // localStorage.removeItem('currentJobDescriptionData');
    console.log('MatchingPage destroyed');
  }
}
