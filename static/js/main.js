async function openMemberModal(memberId) {
    try {
        const response = await fetch(`/member/${memberId}`);
        const member = await response.json();
        
        if (member.error) {
            alert('Member not found');
            return;
        }
        
        // Populate modal with member data (handle null/undefined values)
        document.getElementById('modalMemberName').textContent = member.Name || 'N/A';
        document.getElementById('modalMemberImage').src = member.Image || 'https://via.placeholder.com/150x150/6c757d/ffffff?text=?';
        document.getElementById('modalMemberImage').alt = member.Name || 'Member';
        document.getElementById('modalMemberTitle').textContent = member.Title || 'N/A';
        document.getElementById('modalMemberOrg').textContent = member.Organization || 'N/A';
        document.getElementById('modalMemberIndustry').textContent = member.Industry || 'N/A';
        document.getElementById('modalMemberLocation').textContent = `${member.flag || '🌐'} ${member.City || 'N/A'}, ${member.Country || 'N/A'}`;
        document.getElementById('modalMemberClass').textContent = `Class of ${member.Class || 'N/A'}`;
        
        // Handle LinkedIn URL (might be null/empty/NaN)
        const linkedInElement = document.getElementById('modalLinkedIn');
        if (member.Linkedin && 
            typeof member.Linkedin === 'string' && 
            member.Linkedin !== 'NaN' && 
            member.Linkedin.trim() !== '') {
            linkedInElement.href = member.Linkedin;
            linkedInElement.style.display = 'inline-block';
        } else {
            linkedInElement.style.display = 'none';
        }
        
        // Show modal
        const modal = new bootstrap.Modal(document.getElementById('memberModal'));
        modal.show();
        
    } catch (error) {
        console.error('Error loading member data:', error);
        alert('Error loading member details');
    }
}

// Handle image loading errors in modal
document.addEventListener('DOMContentLoaded', function() {
    const modalImage = document.getElementById('modalMemberImage');
    if (modalImage) {
        modalImage.onerror = function() {
            const name = this.alt || 'Member';
            this.src = `https://via.placeholder.com/150x150/6c757d/ffffff?text=${name[0]}`;
        };
    }
});

// Search functionality
let allMembers = [];
let filteredMembers = [];
let currentFilteredMembers = []; // Store current search results for modal access
let originalMembersHTML = ''; // Store original server-rendered HTML
let searchTimeout;

// Initialize search functionality when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    initializeSearch();
});

function initializeSearch() {
    // Get all search inputs
    const searchInputs = document.querySelectorAll('.search-input');
    const clearFiltersBtn = document.getElementById('clearFilters');
    
    // Store original members data
    storeOriginalMembers();
    
    // Add event listeners to search inputs
    searchInputs.forEach(input => {
        // For text inputs, use immediate response on input events
        if (input.type === 'text') {
            input.addEventListener('input', debounceSearch);
            input.addEventListener('keyup', debounceSearch); // Handle backspace/delete
            input.addEventListener('paste', debounceSearch);
        }
        // For dropdowns, respond immediately to changes
        else {
            input.addEventListener('change', performSearch);
        }
    });
    
    // Clear filters button
    if (clearFiltersBtn) {
        clearFiltersBtn.addEventListener('click', clearAllFilters);
    }
}

function storeOriginalMembers() {
    // Store the initial member data from the server-rendered page
    const memberCards = document.querySelectorAll('.member-card');
    allMembers = Array.from(memberCards).map((card, index) => ({
        element: card.parentElement, // The col-lg-4 div
        index: index
    }));
    
    // Store original HTML content for restore functionality
    const membersGrid = document.getElementById('membersGrid');
    if (membersGrid) {
        originalMembersHTML = membersGrid.innerHTML;
    }
}

function debounceSearch() {
    clearTimeout(searchTimeout);
    searchTimeout = setTimeout(performSearch, 100);
}

async function performSearch() {
    const filters = getSearchFilters();
    
    try {
        // Build query string
        const queryParams = new URLSearchParams();
        Object.entries(filters).forEach(([key, value]) => {
            if (value) {
                queryParams.append(key, value);
            }
        });
        
        // Make API call
        const response = await fetch(`/api/search?${queryParams}`);
        const data = await response.json();
        
        // Update the display
        updateMemberDisplay(data.members);
        updateResultsCounter(data.filtered_count, data.total_count);
        
    } catch (error) {
        console.error('Search error:', error);
        // Fallback to client-side filtering if API fails
        performClientSideSearch(filters);
    }
}

function performClientSideSearch(filters) {
    // Fallback client-side search implementation
    const memberCards = document.querySelectorAll('.member-card');
    let visibleCount = 0;
    
    memberCards.forEach((card, index) => {
        const memberData = extractMemberData(card);
        const matches = checkMemberMatches(memberData, filters);
        
        const container = card.parentElement;
        if (matches) {
            container.style.display = 'block';
            visibleCount++;
        } else {
            container.style.display = 'none';
        }
    });
    
    updateResultsCounter(visibleCount, memberCards.length);
}

function extractMemberData(card) {
    return {
        name: card.querySelector('.card-title')?.textContent || '',
        title: card.querySelector('.text-muted')?.textContent || '',
        organization: card.querySelector('.text-secondary')?.textContent || '',
        country: card.querySelector('.country')?.textContent || ''
    };
}

function checkMemberMatches(member, filters) {
    if (filters.name && !member.name.toLowerCase().includes(filters.name.toLowerCase())) {
        return false;
    }
    if (filters.title && !member.title.toLowerCase().includes(filters.title.toLowerCase())) {
        return false;
    }
    if (filters.country && member.country !== filters.country) {
        return false;
    }
    return true;
}

function getSearchFilters() {
    return {
        name: document.getElementById('searchName')?.value || '',
        city: document.getElementById('searchCity')?.value || '',
        country: document.getElementById('searchCountry')?.value || '',
        class: document.getElementById('searchClass')?.value || '',
        title: document.getElementById('searchTitle')?.value || '',
        industry: document.getElementById('searchIndustry')?.value || ''
    };
}

function updateMemberDisplay(members) {
    const membersGrid = document.getElementById('membersGrid');
    
    // Store current filtered members for modal access
    currentFilteredMembers = members;
    
    if (members.length === 0) {
        membersGrid.innerHTML = `
            <div class="col-12 text-center py-5">
                <h5 class="text-muted">No members found matching your search criteria</h5>
                <p class="text-muted">Try adjusting your filters</p>
            </div>
        `;
        return;
    }
    
    // Generate HTML for filtered members
    const membersHTML = members.map((member, index) => `
        <div class="col-lg-4 col-md-6">
            <div class="member-card card h-100 shadow-sm">
                <div class="card-body text-center p-4">
                    <div class="member-avatar mb-3">
                        <img src="${member.Image}" alt="${member.Name}" 
                             class="rounded-circle" 
                             onerror="this.src='https://via.placeholder.com/120x120/6c757d/ffffff?text=${member.Name[0]}'">
                    </div>
                    
                    <h5 class="card-title mb-2">${member.Name}</h5>
                    <p class="text-muted mb-2">${member.Title}</p>
                    <p class="small text-secondary mb-3">${member.Organization}</p>
                    
                    <div class="location-info mb-3">
                        <span class="flag">${member.flag}</span>
                        <span class="city">${member.City}</span>
                    </div>
                    
                    <div class="d-flex justify-content-center align-items-center gap-3">
                        <a href="${member.Linkedin}" target="_blank" class="linkedin-link">
                            <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/c/ca/LinkedIn_logo_initials.png/960px-LinkedIn_logo_initials.png" 
                                 alt="LinkedIn" class="linkedin-icon">
                        </a>
                        <button class="btn btn-dark btn-sm" onclick="openMemberModalFromData(${index})">
                            View Profile
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `).join('');
    
    membersGrid.innerHTML = membersHTML;
}

// Modal function for filtered results
function openMemberModalFromData(index) {
    if (index < 0 || index >= currentFilteredMembers.length) {
        alert('Member not found');
        return;
    }
    
    const member = currentFilteredMembers[index];
    
    // Populate modal with member data (handle null/undefined values)
    document.getElementById('modalMemberName').textContent = member.Name || 'N/A';
    document.getElementById('modalMemberImage').src = member.Image || 'https://via.placeholder.com/150x150/6c757d/ffffff?text=?';
    document.getElementById('modalMemberImage').alt = member.Name || 'Member';
    document.getElementById('modalMemberTitle').textContent = member.Title || 'N/A';
    document.getElementById('modalMemberOrg').textContent = member.Organization || 'N/A';
    document.getElementById('modalMemberIndustry').textContent = member.Industry || 'N/A';
    document.getElementById('modalMemberLocation').textContent = `${member.flag || '🌐'} ${member.City || 'N/A'}, ${member.Country || 'N/A'}`;
    document.getElementById('modalMemberClass').textContent = `Class of ${member.Class || 'N/A'}`;
    
    // Handle LinkedIn URL (might be null/empty/NaN)
    const linkedInElement = document.getElementById('modalLinkedIn');
    if (member.Linkedin && 
        typeof member.Linkedin === 'string' && 
        member.Linkedin !== 'NaN' && 
        member.Linkedin.trim() !== '') {
        linkedInElement.href = member.Linkedin;
        linkedInElement.style.display = 'inline-block';
    } else {
        linkedInElement.style.display = 'none';
    }
    
    // Show modal
    const modal = new bootstrap.Modal(document.getElementById('memberModal'));
    modal.show();
}

function updateResultsCounter(filteredCount, totalCount) {
    const counter = document.getElementById('resultsCounter');
    if (counter) {
        counter.textContent = `Showing ${filteredCount} of ${totalCount} members`;
    }
}

function clearAllFilters() {
    // Clear all search inputs
    document.querySelectorAll('.search-input').forEach(input => {
        input.value = '';
    });
    
    // Restore original HTML content instead of making API call
    const membersGrid = document.getElementById('membersGrid');
    if (membersGrid && originalMembersHTML) {
        membersGrid.innerHTML = originalMembersHTML;
    }
    
    // Reset current filtered members to empty (original state uses server-rendered modals)
    currentFilteredMembers = [];
    
    // Update results counter to show all members
    const totalMembers = allMembers.length;
    updateResultsCounter(totalMembers, totalMembers);
}